package spring_boot_backend_notes.database.repository

//import org.bson.types.ObjectId
//import org.springframework.data.mongodb.repository.MongoRepository
//import spring_boot_learn.database.model.User
//
//interface UserRepository: MongoRepository<User,ObjectId> {
//    fun findByEmail(email: String): User?
//}

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import spring_boot_backend_notes.database.model.User

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
}