package com.newsaggregator.rssparser.controller

import com.newsaggregator.rssparser.service.RssParserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/parser")
class RssParserController(
    private val rssParserService: RssParserService
) {
    @PostMapping("/parse")
    fun parseAllSources(): ResponseEntity<Map<String, Any>> {
        try {
            rssParserService.parseAllSources()
            return ResponseEntity.ok(mapOf("status" to "success", "message" to "Parsing completed"))
        } catch (e: Exception) {
            return ResponseEntity.status(500).body(mapOf("status" to "error", "message" to (e.message ?: "Unknown error")))
        }
    }
}

