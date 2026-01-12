package com.newsaggregator.mainservice.service

import com.newsaggregator.mainservice.dto.SourceResponse
import com.newsaggregator.mainservice.model.UserSource
import com.newsaggregator.mainservice.repository.SourceRepository
import com.newsaggregator.mainservice.repository.UserRepository
import com.newsaggregator.mainservice.repository.UserSourceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SourceService(
    private val sourceRepository: SourceRepository,
    private val userRepository: UserRepository,
    private val userSourceRepository: UserSourceRepository
) {
    fun getAllSources(userId: Long?): List<SourceResponse> {
        val sources = sourceRepository.findAll()
        val userSources = userId?.let { userSourceRepository.findByUserId(it).map { it.source.sourceId }.toSet() } ?: emptySet()
        
        return sources.map { source ->
            SourceResponse(
                sourceId = source.sourceId,
                name = source.name,
                url = source.url,
                categoryName = source.category.name,
                isSubscribed = source.sourceId in userSources
            )
        }
    }

    @Transactional
    fun subscribeToSource(userId: Long, sourceId: Long) {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("Пользователь не найден") }
        val source = sourceRepository.findById(sourceId)
            .orElseThrow { IllegalArgumentException("Источник не найден") }
        
        if (!userSourceRepository.existsByUserUserIdAndSourceSourceId(userId, sourceId)) {
            userSourceRepository.save(UserSource(user = user, source = source))
        }
    }

    @Transactional
    fun unsubscribeFromSource(userId: Long, sourceId: Long) {
        val userSource = userSourceRepository.findById(
            com.newsaggregator.mainservice.model.UserSourceId(user = userId, source = sourceId)
        )
        userSource.ifPresent { userSourceRepository.delete(it) }
    }
}

