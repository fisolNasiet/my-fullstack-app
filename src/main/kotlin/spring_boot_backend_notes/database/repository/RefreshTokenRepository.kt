package spring_boot_backend_notes.database.repository

//import org.bson.types.ObjectId
//import org.springframework.data.mongodb.repository.MongoRepository
//import spring_boot_learn.database.model.RefreshToken
//
//interface RefreshTokenRepository: MongoRepository<RefreshToken, ObjectId> {
//    fun findByUserIdAndHashedToken(userId: ObjectId, hashedToken: String): RefreshToken?
//    fun deleteByUserIdAndHashedToken(userId: ObjectId, hashedToken: String): RefreshToken?
//}

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