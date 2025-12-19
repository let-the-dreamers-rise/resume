import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

// Simple test components
const AccessibleForm = () => (
  <form>
    <div>
      <label htmlFor="name">Name</label>
      <input id="name" type="text" required />
    </div>
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" required />
    </div>
    <button type="submit">Submit</button>
  </form>
)

const AccessibleButton = () => (
  <button 
    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    aria-label="Accessible button"
  >
    Click me
  </button>
)

const AccessibleNavigation = () => (
  <nav aria-label="Main navigation" role="navigation">
    <ul>
      <li><a href="/" tabIndex={0}>Home</a></li>
      <li><a href="/about" tabIndex={0}>About</a></li>
      <li><a href="/projects" tabIndex={0}>Projects</a></li>
      <li><a href="/contact" tabIndex={0}>Contact</a></li>
    </ul>
  </nav>
)

describe('Accessibility Tests', () => {
  it('should have properly associated form labels', () => {
    render(<AccessibleForm />)
    
    // Name input should be associated with label
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveAttribute('id', 'name')
    expect(nameInput).toHaveAttribute('required')
    
    // Email input should be associated with label
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('id', 'email')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
  })

  it('should have visible focus indicators', () => {
    render(<AccessibleButton />)
    
    const button = screen.getByRole('button')
    
    // Should have focus ring classes
    expect(button).toHaveClass('focus:outline-none')
    expect(button).toHaveClass('focus:ring-2')
    expect(button).toHaveClass('focus:ring-primary')
    expect(button).toHaveClass('focus:ring-offset-2')
    
    // Should have aria-label
    expect(button).toHaveAttribute('aria-label', 'Accessible button')
  })

  it('should support keyboard navigation', () => {
    render(<AccessibleNavigation />)
    
    const links = screen.getAllByRole('link')
    
    // All links should be focusable
    for (const link of links) {
      expect(link).toHaveAttribute('tabIndex', '0')
    }
    
    // Navigation should have proper ARIA attributes
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('should have proper heading hierarchy', () => {
    const HeadingComponent = () => (
      <main>
        <h1>Main Heading</h1>
        <section>
          <h2>Section Heading</h2>
          <p>Section content with proper hierarchy.</p>
          <h3>Subsection Heading</h3>
          <p>Subsection content.</p>
        </section>
      </main>
    )
    
    render(<HeadingComponent />)
    
    // Should have proper heading levels
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Heading')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Heading')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection Heading')
  })

  it('should have descriptive alt text for images', () => {
    const ImageComponent = () => (
      <div>
        <img src="/test.jpg" alt="Descriptive alt text for the image" />
        <img src="/decorative.jpg" alt="" role="presentation" />
      </div>
    )
    
    render(<ImageComponent />)
    
    // Check descriptive image
    const descriptiveImage = screen.getByAltText('Descriptive alt text for the image')
    expect(descriptiveImage).toBeInTheDocument()
    
    // Check decorative image by querying directly
    const decorativeImage = document.querySelector('img[alt=""]')
    expect(decorativeImage).toHaveAttribute('role', 'presentation')
  })
})
