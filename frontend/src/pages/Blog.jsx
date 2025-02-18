import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'web', name: 'Web Geliştirme' },
    { id: 'mobile', name: 'Mobil Uygulama' },
    { id: 'design', name: 'UI/UX Tasarım' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Modern Web Teknolojileri',
      excerpt: 'Modern web geliştirme araçları ve framework\'leri hakkında detaylı bir inceleme.',
      category: 'web',
      author: 'Ahmet Yılmaz',
      date: '15 Mart 2024',
      readTime: '5 dk',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    },
    // Diğer blog yazıları...
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Blog
          </motion.h1>
          <p className="text-lg text-gray-600 mb-8">
            Teknoloji dünyasından en son gelişmeler ve öğretici içerikler
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <motion.article 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-indigo-600">
                      {categories.find(c => c.id === post.category)?.name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <div className="flex items-center gap-4">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
