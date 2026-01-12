package com.newsaggregator.mainservice.model

import jakarta.persistence.*

@Entity
@Table(name = "user_news")
@IdClass(UserNewsId::class)
data class UserNews(
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id", nullable = false)
    val news: News,
    
    @Column(name = "is_read", nullable = false)
    val isRead: Boolean = false
)

data class UserNewsId(
    val user: Long = 0,
    val news: Long = 0
) : java.io.Serializable

