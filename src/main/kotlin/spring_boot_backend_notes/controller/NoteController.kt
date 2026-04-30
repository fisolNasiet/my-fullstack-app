package spring_boot_backend_notes.controller

/*import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.bson.types.ObjectId
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import spring_boot_learn.database.model.Note
import spring_boot_learn.database.repository.NoteRepository
import java.time.Instant

@RestController
@RequestMapping("/notes")
class NoteController(
    private val repository: NoteRepository,
    private val noteRepository: NoteRepository
) {
    data class NoteRequest(
        val id: String?,
        @field:NotBlank(message = "Title can't be blank.")
        val title: String,
        val content: String,
        val color: Long,
    )

    data class NoteResponse(
        val id: String,
        val title: String,
        val content: String,
        val color: Long,
        val createdAt: Instant
    )

    @PostMapping
    fun save(
        @Valid @RequestBody body: NoteRequest
    ): NoteResponse {
        val ownerId = SecurityContextHolder.getContext().authentication.principal as String
        val note = repository.save(
            Note(
                id = body.id?.let { ObjectId(it) } ?: ObjectId.get(),
                title = body.title,
                content = body.content,
                color = body.color,
                createdAt = Instant.now(),
                ownerId = ObjectId(ownerId)
            )
        )

        return note.toResponse()
    }

    @GetMapping
    fun findByOwnerId(): List<NoteResponse> {
        val ownerId = SecurityContextHolder.getContext().authentication.principal as String
        return repository.findByOwnerId(ObjectId(ownerId)).map {
            it.toResponse()
        }
    }

    @DeleteMapping(path = ["/{id}"])
    fun deleteById(@PathVariable id: String) {
        val note = noteRepository.findById(ObjectId(id)).orElseThrow {
            IllegalArgumentException("Note not found")
        }
        val ownerId = SecurityContextHolder.getContext().authentication.principal as String
        if(note.ownerId.toHexString() == ownerId) {
            repository.deleteById(ObjectId(id))
        }
    }
}

private fun Note.toResponse(): NoteController.NoteResponse {
    return NoteController.NoteResponse(
        id = id.toHexString(),
        title = title,
        content = content,
        color = color,
        createdAt = createdAt
    )
}*/

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import spring_boot_backend_notes.database.model.Note
import spring_boot_backend_notes.database.repository.NoteRepository
import spring_boot_backend_notes.database.repository.UserRepository
import java.time.Instant

@RestController
@RequestMapping("/notes")
class NoteController(
    private val noteRepository: NoteRepository,
    private val userRepository: UserRepository // Needed to fetch the Owner object
) {
    data class NoteRequest(
        val id: Long?, // Changed from String?
        @field:NotBlank(message = "Title can't be blank.")
        val title: String,
        val content: String,
        val color: Long,
    )

    data class NoteResponse(
        val id: Long, // Changed from String
        val title: String,
        val content: String,
        val color: Long,
        val createdAt: Instant
    )

    @PostMapping
    fun save(
        @Valid @RequestBody body: NoteRequest
    ): NoteResponse {
        // Assuming your JWT Filter sets the User ID (Long) as the principal
        val ownerId = (SecurityContextHolder.getContext().authentication.principal as String).toLong()

        // In JPA, we usually fetch the reference to the owner
        val owner = userRepository.findById(ownerId).orElseThrow {
            IllegalArgumentException("User not found")
        }

        val note = noteRepository.save(
            Note(
                id = body.id ?: 0L, // 0L triggers auto-increment in JPA if it's a new entity
                title = body.title,
                content = body.content,
                color = body.color,
                createdAt = Instant.now(),
                owner = owner // Passing the actual User object
            )
        )

        return note.toResponse()
    }

    @GetMapping
    fun findByOwnerId(): List<NoteResponse> {
        val ownerId = (SecurityContextHolder.getContext().authentication.principal as String).toLong()
        return noteRepository.findByOwnerId(ownerId).map { it.toResponse() }
    }

    @DeleteMapping("/{id}")
    fun deleteById(@PathVariable id: Long) {
        val ownerId = (SecurityContextHolder.getContext().authentication.principal as String).toLong()
        val note = noteRepository.findById(id).orElseThrow {
            IllegalArgumentException("Note not found")
        }

        // Compare Longs directly
        if (note.owner.id == ownerId) {
            noteRepository.deleteById(id)
        } else {
            throw IllegalAccessException("You do not own this note")
        }
    }
}

// Extension function updated for Long IDs
private fun Note.toResponse(): NoteController.NoteResponse {
    return NoteController.NoteResponse(
        id = id,
        title = title,
        content = content,
        color = color,
        createdAt = createdAt
    )
}