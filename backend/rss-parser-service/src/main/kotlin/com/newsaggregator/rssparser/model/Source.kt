package com.newsaggregator.rssparser.model

import jakarta.persistence.*

@Entity
@Table(name = "sources")
class Source(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "source_id")
    var sourceId: Long = 0,
    
    @Column(name = "name", nullable = false, unique = true, length = 255)
    var name: String = "",
    
    @Column(name = "rss_url", nullable = false, length = 500)
    var rssUrl: String = "",
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    var category: Category? = null
) {
    constructor() : this(0, "", "", null)
}

@Entity
@Table(name = "categories")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    var categoryId: Long = 0,
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    var name: String = ""
) {
    constructor() : this(0, "")
    
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    var sources: List<Source> = emptyList()
}

