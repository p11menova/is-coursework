package com.newsaggregator.mainservice.controller

import com.newsaggregator.mainservice.dto.TemplateResponse
import com.newsaggregator.mainservice.security.SecurityUtils
import com.newsaggregator.mainservice.service.TemplateService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/templates")
class TemplateController(
    private val templateService: TemplateService
) {
    @GetMapping
    fun getAllTemplates(): ResponseEntity<List<TemplateResponse>> {
        val templates = templateService.getAllTemplates()
        return ResponseEntity.ok(templates)
    }

    @PostMapping("/{templateId}/apply")
    fun applyTemplate(
        @PathVariable templateId: Long
    ): ResponseEntity<Void> {
        val userId = SecurityUtils.getCurrentUserId()
        templateService.applyTemplate(userId, templateId)
        return ResponseEntity.ok().build()
    }
}

