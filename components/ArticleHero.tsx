"use client";
import type { HeroBand } from "@/lib/artikel";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } }
};

export default function ArticleHero({ hero }: { hero: HeroBand }) {
  return (
    <motion.div 
      className="article-hero"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={fadeUp}
        className="breadcrumb"
        dangerouslySetInnerHTML={{ __html: hero.crumb }}
      />
      <motion.h1 
        variants={fadeUp}
        dangerouslySetInnerHTML={{ __html: hero.h1 }} 
      />
      <motion.p
        variants={fadeUp}
        className="subtitle"
        dangerouslySetInnerHTML={{ __html: hero.sub }}
      />
      <motion.p
        variants={fadeUp}
        className="article-meta"
        dangerouslySetInnerHTML={{ __html: hero.meta }}
      />
    </motion.div>
  );
}
