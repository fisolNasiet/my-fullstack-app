package spring_boot_backend_notes.database.model

//import org.bson.types.ObjectId
//import org.springframework.data.annotation.Id
//import org.springframework.data.mongodb.core.mapping.Document
//
//@Document("users")
//data class User(
//    val email: String,
//    val hashedPassword: String,
//    @Id val id: ObjectId = ObjectId()
//)

import jakarta.persistence.*

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    val email: String,

    @Column(nullable = false)
    val hashedPassword: String
)
