package com.newsaggregator.mainservice.controller

import com.newsaggregator.mainservice.dto.SourceResponse
import com.newsaggregator.mainservice.security.SecurityUtils
import com.newsaggregator.mainservice.service.SourceService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/sources")
class SourceController(
    private val sourceService: SourceService
) {
    @GetMapping
    fun getAllSources(): ResponseEntity<List<SourceResponse>> {
        val userId = try {
            SecurityUtils.getCurrentUserId()
        } catch (e: IllegalStateException) {
            null
        }
        val sources = sourceService.getAllSources(userId)
        return ResponseEntity.ok(sources)
    }

    @PostMapping("/{sourceId}/subscribe")
    fun subscribeToSource(
        @PathVariable sourceId: Long
    ): ResponseEntity<Void> {
        val userId = SecurityUtils.getCurrentUserId()
        sourceService.subscribeToSource(userId, sourceId)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/{sourceId}/subscribe")
    fun unsubscribeFromSource(
        @PathVariable sourceId: Long
    ): ResponseEntity<Void> {
        val userId = SecurityUtils.getCurrentUserId()
        sourceService.unsubscribeFromSource(userId, sourceId)
        return ResponseEntity.ok().build()
    }
}

