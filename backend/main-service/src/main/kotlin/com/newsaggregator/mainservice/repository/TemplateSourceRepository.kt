package com.newsaggregator.mainservice.repository

import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface TemplateSourceRepository : JpaRepository<TemplateSourceEntity, TemplateSourceId> {
    @Query(value = "SELECT source_id FROM template_sources WHERE template_id = :templateId", nativeQuery = true)
    fun findSourceIdsByTemplateId(@Param("templateId") templateId: Long): List<Long>
}

data class TemplateSourceId(
    val templateId: Long,
    val sourceId: Long
) : java.io.Serializable

@Entity
@Table(name = "template_sources")
@IdClass(TemplateSourceId::class)
data class TemplateSourceEntity(
    @Id
    @Column(name = "template_id")
    val templateId: Long,
    
    @Id
    @Column(name = "source_id")
    val sourceId: Long
)

