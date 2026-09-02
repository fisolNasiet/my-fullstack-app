package spring_boot_backend_notes.database.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import spring_boot_backend_notes.database.model.RefreshToken
import spring_boot_backend_notes.database.model.User

@Repository
interface RefreshTokenRepository : JpaRepository<RefreshToken, Long> {

    fun findByUserIdAndHashedToken(userId: Long, hashedToken: String): RefreshToken?

    @Transactional // Required for delete operations in JPA
    fun deleteByUserIdAndHashedToken(userId: Long, hashedToken: String)

    @Transactional
    fun deleteByUser(user: User)
}