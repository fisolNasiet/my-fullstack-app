package spring_boot_backend_notes.database.model

//import org.bson.types.ObjectId
//import org.springframework.data.annotation.Id
//import org.springframework.data.mongodb.core.mapping.Document
//import java.time.Instant
//
//@Document("notes")
//data class Note(
//    val title: String,
//    val content: String,
//    val color: Long,
//    val createdAt: Instant,
//    val ownerId: ObjectId,
//    @Id val id: ObjectId = ObjectId.get()
//)

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "notes")
class Note(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var title: String,

    @Column(columnDefinition = "TEXT")
    var content: String,

    val color: Long,

    @Column(nullable = false)
    val createdAt: Instant = Instant.now(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    val owner: User
)