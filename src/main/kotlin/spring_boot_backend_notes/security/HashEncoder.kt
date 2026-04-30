package spring_boot_backend_notes.security

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component

@Component
class HashEncoder {

    private val bcrypt = BCryptPasswordEncoder()

    fun encoder(raw: String): String = bcrypt.encode(raw)

    fun matches(raw: String, hashed: String): Boolean = bcrypt.matches(raw,hashed)
}