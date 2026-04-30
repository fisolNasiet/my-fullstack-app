package spring_boot_backend_notes.database.repository

//import org.bson.types.ObjectId
//import org.springframework.data.mongodb.repository.MongoRepository
//import spring_boot_learn.database.model.Note
//
//interface NoteRepository:MongoRepository<Note,ObjectId> {
//    fun findByOwnerId(ownerId: ObjectId): List<Note>
//}

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import spring_boot_backend_notes.database.model.Note

@Repository
interface NoteRepository : JpaRepository<Note, Long> {
    // Searches by the ID of the 'owner' relationship
    fun findByOwnerId(ownerId: Long): List<Note>
}