package com.newsaggregator.mainservice.model

import jakarta.persistence.*

@Entity
@Table(name = "user_sources")
@IdClass(UserSourceId::class)
data class UserSource(
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    val source: Source
)

data class UserSourceId(
    val user: Long = 0,
    val source: Long = 0
) : java.io.Serializable

