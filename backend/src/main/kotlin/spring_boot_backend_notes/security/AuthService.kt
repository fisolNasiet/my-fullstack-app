package spring_boot_backend_notes.security

import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import spring_boot_backend_notes.database.model.RefreshToken
import spring_boot_backend_notes.database.model.User
import spring_boot_backend_notes.database.repository.NoteRepository
import spring_boot_backend_notes.database.repository.RefreshTokenRepository
import spring_boot_backend_notes.database.repository.UserRepository
import java.security.MessageDigest
import java.time.Instant
import java.util.*

@Service
class AuthService(
    private val jwtService: JwtService,
    private val userRepository: UserRepository,
    private val hashEncoder: HashEncoder,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val noteRepository: NoteRepository
) {

    data class TokenPair(
        val accessToken: String,
        val refreshToken: String
    )

    fun register(email: String, password: String): User {
        val user = userRepository.findByEmail(email.trim())
        if (user != null) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "A user with that email already exists.")
        }
        return userRepository.save(
            User(
                email = email,
                hashedPassword = hashEncoder.encoder(password)
            )
        )
    }

    fun login(email: String, password: String): TokenPair {
        val user = userRepository.findByEmail(email) ?: throw UsernameNotFoundException("Invalid credentials.")
        if (!hashEncoder.matches(password, user.hashedPassword)) {
            throw BadCredentialsException("invalid credentials.")
        }

        // Convert Long ID to String for JWT payload
        val userIdString = user.id.toString()
        val newAccessToken = jwtService.generateAccessToken(userIdString)
        val newRefreshToken = jwtService.generateRefreshToken(userIdString)

        storeRefreshToken(user, newRefreshToken) // Now passing the User entity

        return TokenPair(
            accessToken = newAccessToken,
            refreshToken = newRefreshToken
        )
    }

    @Transactional
    fun refresh(refreshToken: String): TokenPair {
        if (!jwtService.validateRefreshToken(refreshToken)) {
            throw ResponseStatusException(HttpStatusCode.valueOf(401), "Invalid refresh token.")
        }

        val userIdString = jwtService.getUserIdFromToken(refreshToken)
        val userId = userIdString.toLong() // Convert back to Long for MySQL

        val user = userRepository.findById(userId).orElseThrow {
            ResponseStatusException(HttpStatusCode.valueOf(401), "Invalid refresh token.")
        }

        val hashed = hashToken(refreshToken)

        // Find by userId (Long) and hash
        refreshTokenRepository.findByUserIdAndHashedToken(userId, hashed)
            ?: throw ResponseStatusException(HttpStatusCode.valueOf(401), "Refresh token not recognized.")

        refreshTokenRepository.deleteByUserIdAndHashedToken(userId, hashed)

        val newAccessToken = jwtService.generateAccessToken(userIdString)
        val newRefreshToken = jwtService.generateRefreshToken(userIdString)

        storeRefreshToken(user, newRefreshToken)

        return TokenPair(
            accessToken = newAccessToken,
            refreshToken = newRefreshToken
        )
    }

    @Transactional
    fun storeRefreshToken(user: User, rawRefreshToken: String) {

        // 1. Delete the old token for this user to prevent the "Duplicate Entry" crash
        refreshTokenRepository.deleteByUser(user)

        // 2. Generate the new token parameters
        val hashed = hashToken(rawRefreshToken)
        val expiryMs = jwtService.refreshTokenValidityMs
        val expiresAt = Instant.now().plusMillis(expiryMs)

        // 3. Save the new token
        refreshTokenRepository.save(
            RefreshToken(
                user = user,
                expiresAt = expiresAt,
                hashedToken = hashed
            )
        )
    }

    @Transactional
    fun deleteAccount(userId: Long) {
        val user = userRepository.findById(userId).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
        }
        noteRepository.deleteByOwnerId(userId)
        refreshTokenRepository.deleteByUser(user)
        userRepository.delete(user)
    }

    private fun hashToken(token: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(token.encodeToByteArray())
        return Base64.getEncoder().encodeToString(hashBytes)
    }
}