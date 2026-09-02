package spring_boot_backend_notes.database.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import spring_boot_backend_notes.database.model.Note

@Repository
interface NoteRepository : JpaRepository<Note, Long> {
    // Searches by the ID of the 'owner' relationship
    fun findByOwnerId(ownerId: Long): List<Note>

    @Transactional
    fun deleteByOwnerId(ownerId: Long)
}