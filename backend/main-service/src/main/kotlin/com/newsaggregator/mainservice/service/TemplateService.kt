package com.newsaggregator.mainservice.service

import com.newsaggregator.mainservice.dto.TemplateResponse
import com.newsaggregator.mainservice.repository.SourceRepository
import com.newsaggregator.mainservice.repository.TemplateRepository
import com.newsaggregator.mainservice.repository.TemplateSourceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TemplateService(
    private val templateRepository: TemplateRepository,
    private val templateSourceRepository: TemplateSourceRepository,
    private val sourceRepository: SourceRepository,
    private val sourceService: SourceService
) {
    fun getAllTemplates(): List<TemplateResponse> {
        val templates = templateRepository.findAll()
        return templates.map { template ->
            val sourceIds = templateSourceRepository.findSourceIdsByTemplateId(template.templateId)
            val sources = sourceRepository.findAllById(sourceIds)
            TemplateResponse(
                templateId = template.templateId,
                name = template.name,
                description = template.description,
                categoryName = template.category?.name,
                sourceNames = sources.map { it.name }
            )
        }
    }
    
    @Transactional
    fun applyTemplate(userId: Long, templateId: Long) {
        val template = templateRepository.findById(templateId)
            .orElseThrow { IllegalArgumentException("Шаблон не найден") }
        
        val sourceIds = templateSourceRepository.findSourceIdsByTemplateId(templateId)
        
        sourceIds.forEach { sourceId ->
            try {
                sourceService.subscribeToSource(userId, sourceId)
            } catch (e: Exception) {
                // Игнорируем ошибки, если уже подписан
            }
        }
    }
}
