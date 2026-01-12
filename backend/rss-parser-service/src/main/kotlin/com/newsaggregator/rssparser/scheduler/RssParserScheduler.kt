package com.newsaggregator.rssparser.scheduler

import com.newsaggregator.rssparser.service.RssParserService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class RssParserScheduler(
    private val rssParserService: RssParserService
) {
    @Scheduled(fixedDelayString = "\${rss.parser.interval:300000}")
    fun parseRssFeeds() {
        rssParserService.parseAllSources()
    }
}

