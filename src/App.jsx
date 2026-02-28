import './App.css'
import Layout from './components/Layout'
import Hero from './components/Hero'
import About from './components/About'
import ProjectGrid from './components/ProjectGrid'
import AtlasButton from './components/AtlasButton'
import { motion } from 'framer-motion'

function App() {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero />

      {/* Work Section - Show work first */}
      <ProjectGrid />

      {/* About Section - Context after seeing work */}
      <About />

      {/* Contact Section */}
      <section id="contact" className="relative overflow-hidden px-6 py-32 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              // Contact
            </span>
            <h2 className="mt-4 text-[clamp(2.5rem,8vw,6rem)] font-bold leading-none tracking-tighter">
              LET'S CREATE
              <br />
              <span className="text-accent">SOMETHING GREAT</span>
            </h2>
            <p className="mx-auto mt-8 max-w-lg text-lg text-white/50">
              Have a project in mind? Let's collaborate and bring your vision to life.
            </p>
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <AtlasButton href="mailto:viktor.stang@hotmail.com">
                GET IN TOUCH
              </AtlasButton>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="mt-16 flex items-center justify-center gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {['LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="https://www.linkedin.com/in/viktor-stang/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 transition-colors hover:text-accent"
                >
                  {social}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>

      </section>
    </Layout>
  )
}

export default App
