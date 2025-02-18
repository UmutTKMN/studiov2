import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Technologies from '../components/home/Technologies';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProjects />
      <Technologies />
      <ContactSection />
    </div>
  );
}
