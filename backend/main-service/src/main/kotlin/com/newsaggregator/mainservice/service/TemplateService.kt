package com.newsaggregator.mainservice.service

import com.newsaggregator.mainservice.dto.TemplateResponse
import com.newsaggregator.mainservice.repository.SourceRepository
import com.newsaggregator.mainservice.repository.TemplateRepository
import com.newsaggregator.mainservice.repository.TemplateSourceRepository
import org.springframework.stereotype.Service

@Service
class TemplateService(
    private val templateRepository: TemplateRepository,
    private val templateSourceRepository: TemplateSourceRepository,
    private val sourceRepository: SourceRepository
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
}
