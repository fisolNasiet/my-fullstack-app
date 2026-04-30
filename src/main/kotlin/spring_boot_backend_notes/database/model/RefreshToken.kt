package spring_boot_backend_notes.database.model

//import org.bson.types.ObjectId
//import org.springframework.data.mongodb.core.index.Indexed
//import org.springframework.data.mongodb.core.mapping.Document
//import java.time.Instant
//
//@Document("refresh_tokens")
//data class RefreshToken(
//    val userId: ObjectId,
//    @Indexed(expireAfter = "0s")
//    val expiresAt: Instant,
//    val hashedToken: String,
//    val createdAt: Instant = Instant.now()
//)

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "refresh_tokens")
class RefreshToken(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    val hashedToken: String = "",

    @Column(nullable = false)
    val expiresAt: Instant = Instant.now(),

    @Column(nullable = false)
    val createdAt: Instant = Instant.now(),

    // ⬇️ CHANGE THIS FROM @OneToOne TO @ManyToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User? = null
)