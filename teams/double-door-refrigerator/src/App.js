import React, { useState, useEffect } from 'react';
import { productsData, generateAISummary } from './data';
import './index.css';

// SVG Icons to replace lucide-react
const Icons = {
  Globe: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>,
  Brain: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Heart: ({ fill }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Sparkles: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m18.36 5.64-12.72 12.72"/><path d="m5.64 5.64 12.72 12.72"/></svg>,
  ArrowLeft: () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
};

const Header = ({ setShowAuth, navigateTo, wishlist, setWishlist, theme, toggleTheme }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div onClick={() => navigateTo('home')} className="header-logo" style={{cursor: 'pointer'}}>CompareX</div>
      <nav className="header-nav">
        <div className="nav-link" style={{cursor:'pointer'}} onClick={() => navigateTo('home')}>HOME</div>
        <div 
          className="nav-link dropdown-container" 
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
            CATEGORIES <Icons.ChevronDown />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => navigateTo('category', 'SSD')}>SSD</div>
              <div className="dropdown-item" onClick={() => navigateTo('category', 'GRAPHICS CARDS')}>GRAPHICS CARDS</div>
              <div className="dropdown-item" onClick={() => navigateTo('category', 'CPUs')}>CPUs</div>
              <div className="dropdown-item" onClick={() => navigateTo('category', 'TOOLS')}>TOOLS</div>
              <div className="dropdown-item" onClick={() => navigateTo('category', 'MEMORY (RAM)')}>MEMORY (RAM)</div>
            </div>
          )}
        </div>
        <div className="nav-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'SSD')}>SSD</div>
        <div className="nav-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'GRAPHICS CARDS')}>GRAPHICS CARDS</div>
        <div className="nav-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'CPUs')}>CPUs</div>
        <div className="nav-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'TOOLS')}>TOOLS</div>
      </nav>
      <div className="header-actions">
        <div style={{ cursor: 'pointer' }} onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
        </div>
        <div 
          style={{ cursor: 'pointer', position: 'relative' }} 
          onClick={() => navigateTo('wishlist')}
        >
          <Icons.Heart fill={wishlist?.length > 0 ? "currentColor" : "none"} />
          {wishlist?.length > 0 && <span style={{position:'absolute', top:-8, right:-8, background:'var(--primary)', color:'#0F172A', fontSize:'0.65rem', fontWeight:'bold', padding:'2px 6px', borderRadius:'10px'}}>{wishlist.length}</span>}
        </div>
        <div style={{ cursor: 'pointer' }}><Icons.Globe /></div>
        <div style={{ cursor: 'pointer' }} onClick={() => setShowAuth(true)}><Icons.User /></div>
      </div>
    </header>
  );
};

const Footer = ({ navigateTo, setShowChat }) => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-column">
        <h4>Top Categories</h4>
        <div className="footer-links">
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'SSD')}>SSD Storage</div>
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'GRAPHICS CARDS')}>Graphics Cards</div>
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'CPUs')}>Processors</div>
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => navigateTo('category', 'TOOLS')}>Dev Tools</div>
        </div>
      </div>
      <div className="footer-column">
        <h4>Get in touch</h4>
        <div className="footer-links">
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => setShowChat(true)}>Suggest a product</div>
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => navigateTo('home')}>Partnerships</div>
        </div>
      </div>
      <div className="footer-column">
        <h4>CompareX</h4>
        <div className="footer-links">
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => navigateTo('about')}>About us</div>
          <div className="footer-link" style={{cursor:'pointer'}} onClick={() => navigateTo('editorial')}>Editorial guidelines</div>
        </div>
      </div>
      <div className="footer-column">
        <h4>Newsletter</h4>
        <div style={{color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1rem'}}>
          Subscribe for our weekly hardware and software analysis.
        </div>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <input type="email" placeholder="Your email" style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.05)', color: 'white', width: '100%'}} />
          <button className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Sub</button>
        </div>
      </div>
      <div className="footer-brand">
        <div className="footer-logo">CompareX</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Compare everything</div>
        <div className="social-icons">
          <div className="social-icon"><Icons.Globe /></div>
          <div className="social-icon"><Icons.User /></div>
        </div>
      </div>
    </div>
  </footer>
);

const ImagePlaceholder = () => (
  <div className="image-placeholder">
    <span>Image Placeholder</span>
  </div>
);

const ProductCard = ({ product, compareList, setCompareList, wishlist, setWishlist, navigateTo }) => {
  const isComparing = !!compareList.find(p => p.id === product.id);
  const inWishlist = !!wishlist.find(p => p.id === product.id);

  const toggleCompare = () => {
    if (isComparing) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, product]);
      } else {
        alert("You can only compare up to 3 items side-by-side.");
      }
    }
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      setWishlist(wishlist.filter(p => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <div className="product-card">
      <div style={{flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column'}} onClick={() => navigateTo('product', product.id)}>
        <div className="product-image-container">
          {product.image ? (
            product.category === 'TOOLS' ? (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-glass-strong)', padding: '1.5rem' }}>
                <img src={product.image} alt={product.title} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,240,255,0.15))' }} onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<span style="color:var(--text-dim);font-size:0.8rem">' + product.title + '</span>'; }} />
              </div>
            ) : (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-glass-strong)', padding: '1rem' }}>
                <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} className="product-image" />
              </div>
            )
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="product-info">
          {product.isNew && <span className="badge-new">New product / </span>}
          <h3 className="product-title">{product.title}</h3>
          <p className="product-subtitle">{product.subtitle}</p>
          {product.scores && product.scores.Overall && (
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--tertiary))', color: '#0F172A', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {product.scores.Overall}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>CompareXscore</span>
            </div>
          )}
        </div>
      </div>
      <div className="card-actions">
        <button 
          className={`btn-icon ${isComparing ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleCompare(); }}
          title="Add to compare"
        >
          {isComparing ? <Icons.Check /> : <Icons.Plus />}
        </button>
        <button 
          className={`btn-icon ${inWishlist ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(); }}
          title="Add to wishlist"
        >
          <Icons.Heart fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

const WaveDivider = () => (
  <div className="wave-divider">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
    </svg>
  </div>
);

const Home = ({ compareList, setCompareList, wishlist, setWishlist, navigateTo }) => {
  const topProducts = [
    productsData.find(p => p.id === 101),
    productsData.find(p => p.id === 201),
    productsData.find(p => p.id === 301),
    productsData.find(p => p.id === 401),
  ].filter(Boolean);

  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const searchResults = productsData.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleSelectProduct = (id) => {
    setSearchTerm('');
    setShowResults(false);
    navigateTo('product', id);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1 className="heading-xl">Compare Everything</h1>
          <p className="hero-subtitle">Compare Hardware, Software, Tools, and much more</p>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <div className="search-container" style={{ margin: 0 }}>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Type here to compare" 
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
              />
              <button className="btn btn-primary" onClick={() => searchResults.length > 0 && handleSelectProduct(searchResults[0].id)}>Search</button>
            </div>
            {showResults && searchTerm.trim() !== '' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                marginTop: '0.5rem',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 50,
                textAlign: 'left'
              }}>
                {searchResults.length > 0 ? (
                  searchResults.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handleSelectProduct(p.id)}
                      style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,240,255,0.05)'; e.currentTarget.style.color = '#00F0FF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-main)'; }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: p.category === 'TOOLS' ? 'rgba(0,0,0,0.3)' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: p.category === 'TOOLS' ? '0' : '4px' }}>
                        <img src={p.image || 'https://via.placeholder.com/40'} alt={p.title} style={{ width: p.category === 'TOOLS' ? '75%' : '100%', height: p.category === 'TOOLS' ? '75%' : '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'inherit' }}>{p.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{p.category}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1rem', color: 'var(--text-dim)', textAlign: 'center' }}>No products found</div>
                )}
              </div>
            )}
          </div>
        </div>
        <WaveDivider />
      </section>

      <section className="products-section">
        <h2 className="heading-lg" style={{marginBottom: '2rem'}}>Featured Products</h2>
        <div className="product-grid">
          {topProducts.map(product => (
             <ProductCard 
              key={product.id} 
              product={product} 
              compareList={compareList} setCompareList={setCompareList}
              wishlist={wishlist} setWishlist={setWishlist}
              navigateTo={navigateTo}
             />
          ))}
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2 className="heading-lg">94k products in 106 categories.<br/>A single objective.</h2>
          <p>We have been working for more than a decade to become your reference guide when it comes to comparisons. We are an impartial team of technology enthusiasts: our sole mission is to help you make informed decisions.</p>
          <div className="mission-actions">
            <button className="btn btn-primary" onClick={() => navigateTo('category', 'GRAPHICS CARDS')}>See all categories</button>
            <div className="link-action" style={{cursor: 'pointer'}} onClick={() => navigateTo('home')}>How we work →</div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CategoryPage = ({ categoryName, compareList, setCompareList, wishlist, setWishlist, navigateTo }) => {
  const products = productsData.filter(p => p.category === categoryName);

  return (
    <div>
      <section className="hero" style={{ padding: '10rem 2rem 4rem' }}>
        <div className="hero-content">
          <h1 className="heading-xl">{categoryName}</h1>
          <p className="hero-subtitle">Browse top {categoryName} and find what works for you.</p>
        </div>
        <WaveDivider />
      </section>

      <section className="products-section">
        <div className="product-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              compareList={compareList} setCompareList={setCompareList}
              wishlist={wishlist} setWishlist={setWishlist}
              navigateTo={navigateTo}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

const Compare = ({ compareList, setCompareList, navigateTo }) => {
  if (compareList.length === 0) {
    return (
      <div>
        <section className="hero" style={{ padding: '10rem 2rem 4rem' }}>
          <div className="hero-content">
            <h2 className="heading-lg">Nothing to compare</h2>
            <p className="hero-subtitle">Go back to the home page and add some items.</p>
            <button className="btn btn-primary" style={{marginTop: '2rem'}} onClick={() => navigateTo('home')}>Go to Home</button>
          </div>
          <WaveDivider />
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="hero" style={{ padding: '10rem 2rem 4rem' }}>
        <div className="hero-content">
          <h1 className="heading-lg">Side-by-side Comparison</h1>
          <button className="btn btn-dark" style={{marginTop: '1rem'}} onClick={() => navigateTo('home')}>Add More Items</button>
        </div>
        <WaveDivider />
      </section>

      <section className="products-section">
        <div className="compare-grid" style={{ gridTemplateColumns: `repeat(${compareList.length}, 1fr)` }}>
          {compareList.map(product => (
            <div key={product.id} className="compare-col">
              <button className="btn-icon" style={{float: 'right'}} onClick={() => setCompareList(compareList.filter(p => p.id !== product.id))}>
                <Icons.X />
              </button>
              {product.image ? (
                product.category === 'TOOLS' ? (
                  <div className="compare-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(10,22,40,0.95))', padding: '1rem', borderRadius: '12px' }}>
                    <img src={product.image} alt={product.title} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,240,255,0.2))' }} onError={(e) => { e.target.style.display='none'; }} />
                  </div>
                ) : (
                  <div className="compare-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px' }}>
                    <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                )
              ) : (
                <div className="compare-img" style={{background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: 'var(--text-dim)', fontSize: '0.8rem'}}>No image</span>
                </div>
              )}
              <h3 className="heading-md">{product.title}</h3>
              <p className="product-subtitle" style={{marginBottom: '1.5rem'}}>{product.category}</p>

              <h4 className="heading-sm" style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>Scores</h4>
              {product.scores && (
                <div style={{marginBottom: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                    <span>Overall</span>
                    <span style={{color: 'var(--primary)'}}>{product.scores.Overall}</span>
                  </div>
                  {Object.entries(product.scores).filter(([k]) => k !== 'Overall').map(([key, value]) => (
                    <div key={key} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.2rem'}}>
                      <span style={{color: 'var(--text-muted)'}}>{key}</span>
                      <span style={{color: 'var(--text-main)'}}>{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {product.category === 'TOOLS' && product.specifications?.Description && (
                <div style={{marginBottom: '1.5rem', background: 'var(--bg-glass)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)'}}>
                  <h4 className="heading-sm" style={{marginBottom: '0.5rem'}}>About</h4>
                  <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem'}}>{product.specifications.Description}</p>
                  
                  <h4 className="heading-sm" style={{marginBottom: '0.5rem'}}>Primary Use Case</h4>
                  <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0}}>{product.specifications.PrimaryUseCase}</p>
                </div>
              )}

              {product.category === 'TOOLS' && (
                <div style={{marginBottom: '1.5rem', background: 'var(--bg-glass)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)'}}>
                  <h4 className="heading-sm" style={{marginBottom: '0.5rem'}}>Pricing & Plans</h4>
                  {product.specifications?.FreeTier ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <div><strong style={{color: 'var(--primary)'}}>Free:</strong> <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{product.specifications.FreeTier}</span></div>
                      <div><strong style={{color: 'var(--tertiary)'}}>Pro:</strong> <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{product.specifications.ProTier}</span></div>
                      <div><strong style={{color: '#a78bfa'}}>Enterprise:</strong> <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{product.specifications.EnterpriseTier}</span></div>
                    </div>
                  ) : (
                    <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0}}><strong style={{color: '#10b981'}}>Open Source & Free</strong><br/>License: {product.specifications?.License || 'Open Source'}</p>
                  )}
                </div>
              )}

              <h4 className="heading-sm" style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>{product.category === 'TOOLS' ? 'Tool Details' : 'Specifications'}</h4>
              <dl className="feature-list">
                {Object.entries(product.specifications || product.features).filter(([key]) => !['Description', 'PrimaryUseCase', 'FreeTier', 'ProTier', 'EnterpriseTier'].includes(key)).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>

              {product.benchmarks && (
                <>
                  <h4 className="heading-sm" style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>{product.category === 'TOOLS' ? 'Community Metrics' : 'User Benchmarks'}</h4>
                  <dl className="feature-list">
                    {Object.entries(product.benchmarks).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <dt>{key}</dt>
                        <dd>{value}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const WishlistPage = ({ wishlist, setWishlist, navigateTo, compareList, setCompareList }) => {
  return (
    <div>
      <section className="hero" style={{ padding: '10rem 2rem 4rem' }}>
        <div className="hero-content">
          <h1 className="heading-xl">Your Wishlist</h1>
          <p className="hero-subtitle">{wishlist.length} items saved</p>
        </div>
        <WaveDivider />
      </section>

      <section className="products-section">
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 className="heading-md" style={{ color: 'var(--text-dim)' }}>Your wishlist is currently empty.</h2>
            <button className="btn btn-primary" style={{marginTop: '2rem'}} onClick={() => navigateTo('home')}>Explore Products</button>
          </div>
        ) : (
          <div className="product-grid">
            {wishlist.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                compareList={compareList} setCompareList={setCompareList}
                wishlist={wishlist} setWishlist={setWishlist}
                navigateTo={navigateTo}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const ProductDetail = ({ productId, navigateTo }) => {
  const product = productsData.find(p => p.id === productId);

  if (!product) return <div style={{padding: '10rem 2rem', textAlign: 'center', color: 'var(--text-muted)'}}>Product Not Found</div>;

  const avgRating = product.ratingStats?.avg || "0.0";
  const ratingCounts = product.ratingStats || {total: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0};

  return (
    <div>
      <section className="hero" style={{ padding: '8rem 2rem 2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '6.5rem', left: '2rem', zIndex: 10 }}>
          <div style={{ cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-block', transition: 'all 0.3s', padding: '0.5rem 0' }} onClick={() => navigateTo('category', product.category)} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <Icons.ArrowLeft />
          </div>
        </div>
        <WaveDivider />
      </section>

      <section className="products-section" style={{ paddingTop: '0', marginTop: '-4rem', position: 'relative', zIndex: 20 }}>
        {/* Product Header Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ flex: '0 0 250px' }}>
            {product.image ? (
              product.category === 'TOOLS' ? (
                <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(10,22,40,1))', borderRadius: '16px', border: '1px solid var(--border-glass)', padding: '2rem', boxShadow: '0 0 30px rgba(0,240,255,0.08)' }}>
                  <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 20px rgba(0,240,255,0.2))' }} onError={(e) => { e.target.style.display='none'; }} />
                </div>
              ) : (
                <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' }}>
                  <img src={product.image} alt={product.title} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                </div>
              )
            ) : (
              <div style={{background: 'rgba(0,0,0,0.3)', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'}}>
                <span style={{color: 'var(--text-dim)'}}>Image Placeholder</span>
              </div>
            )}
          </div>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', paddingRight: '2rem' }}>
            <h1 className="heading-xl" style={{ margin: 0 }}>{product.title}</h1>
            <p style={{fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '0.75rem', maxWidth: '600px'}}>
              {product.subtitle}. {product.category === 'TOOLS' ? `This software tool is preferred by developers across the globe. CompareX aggregate data confirms its position as a leading choice for open-source development.` : `This ${product.category.toLowerCase()} is highly documented emphasizing pure performance. CompareX aggregate data confirms it stands out for long-term usage and robust feature inclusion.`}
            </p>
          </div>
        </div>

        {/* About Feature */}
        {product.category === 'TOOLS' && product.specifications?.Description && (
          <div style={{ marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)', borderLeft: '3px solid var(--primary)' }}>
            <h3 className="heading-lg" style={{marginBottom: '1.5rem'}}>About this Tool</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div>
                <h4 style={{fontWeight: 'bold', color: 'var(--text-light)', marginBottom: '0.5rem', fontSize: '1.1rem'}}>Description</h4>
                <p style={{fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0}}>{product.specifications.Description}</p>
              </div>
              <div>
                <h4 style={{fontWeight: 'bold', color: 'var(--text-light)', marginBottom: '0.5rem', fontSize: '1.1rem'}}>Primary Use Case</h4>
                <p style={{fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0}}>{product.specifications.PrimaryUseCase}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Plans Section for TOOLS */}
        {product.category === 'TOOLS' && (
          <div style={{ marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
            <h3 className="heading-lg" style={{marginBottom: '1.5rem'}}>Pricing & Plans</h3>
            {product.specifications?.FreeTier ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', borderTop: '3px solid #10b981', border: '1px solid var(--border-glass)', borderTopColor: '#10b981' }}>
                  <h4 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#10b981'}}>Free Tier</h4>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0}}>{product.specifications.FreeTier}</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', borderTop: '3px solid var(--tertiary)', border: '1px solid var(--border-glass)', borderTopColor: 'var(--tertiary)' }}>
                  <h4 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--tertiary)'}}>Pro Tier</h4>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0}}>{product.specifications.ProTier}</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', borderTop: '3px solid #a78bfa', border: '1px solid var(--border-glass)', borderTopColor: '#a78bfa' }}>
                  <h4 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#a78bfa'}}>Enterprise Tier</h4>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0}}>{product.specifications.EnterpriseTier}</p>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid #10b981', border: '1px solid var(--border-glass)', borderLeftColor: '#10b981' }}>
                <h4 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#10b981'}}>Open Source & Free</h4>
                <p style={{color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0}}>This tool does not have paid subscription tiers. It is free to use under its respective license: <strong style={{color: 'var(--text-light)'}}>{product.specifications?.License || 'Open Source'}</strong>.</p>
              </div>
            )}
          </div>
        )}

        {/* Specifications */}
        {product.specifications && (
          <div style={{ marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
            <h3 className="heading-lg" style={{marginBottom: '1.5rem'}}>{product.category === 'TOOLS' ? 'Tool Details' : 'Specifications'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(product.specifications).filter(([key]) => !['Description', 'PrimaryUseCase', 'FreeTier', 'ProTier', 'EnterpriseTier'].includes(key)).map(([key, value]) => (
                <div key={key} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{key}</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '1.05rem' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CompareXscore */}
        {product.scores && (
          <div style={{ marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
            <h3 className="heading-lg" style={{marginBottom: '2rem'}}>CompareXscore</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'center' }}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '140px', height: '140px', borderRadius: '50%', border: '4px solid transparent', background: 'linear-gradient(var(--bg-dark), var(--bg-dark)) padding-box, linear-gradient(135deg, var(--primary), var(--tertiary)) border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0,240,255,0.15)'}}>
                  <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-light)', lineHeight: '1' }}>{product.scores.Overall}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>out of 100</span>
                </div>
                <div style={{marginTop: '1rem', fontWeight: '600', color: 'var(--text-muted)'}}>Overall Score</div>
              </div>
              
              <div>
                {Object.entries(product.scores).filter(([k]) => k !== 'Overall').map(([key, value]) => (
                  <div key={key} style={{marginBottom: '1rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '0.3rem'}}>
                      <span style={{fontWeight: '500', color: 'var(--text-main)' }}>{key}</span>
                      <span style={{fontWeight: 'bold', color: 'var(--primary)'}}>{value}/100</span>
                    </div>
                    <div style={{height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{height: '100%', width: value + '%', background: 'linear-gradient(90deg, var(--primary), var(--tertiary))', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,240,255,0.3)', transition: 'width 1s ease'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Benchmarks */}
        {product.benchmarks && (
          <div style={{ marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(0,240,255,0.1)' }}>
            <h3 className="heading-lg" style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Icons.Sparkles /> {product.category === 'TOOLS' ? 'Community Metrics' : 'User Benchmarks'}</h3>
            <p style={{color: 'var(--text-dim)', marginBottom: '2rem'}}>{product.category === 'TOOLS' ? 'Aggregated community metrics and usage statistics derived from open source development data.' : 'Aggregated real-life benchmarks and metrics calculated using community hardware reporting.'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(product.benchmarks).map(([key, value]) => (
                <div key={key} style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.05), rgba(8,125,209,0.05))', border: '1px solid var(--border-glass)', color: 'var(--text-light)', padding: '1.5rem', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{key}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buy Links */}
        {product.prices && (
          <div style={{ marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
            <h3 className="heading-lg" style={{marginBottom: '1.5rem'}}>{product.category === 'TOOLS' ? 'Official Links' : 'Where to buy'}</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
              {Object.entries(product.prices).filter(([store]) => product.category !== 'TOOLS' || store === 'official').map(([store, details]) => (
                <a href={details.link} target="_blank" rel="noopener noreferrer" key={store} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border-glass)', borderRadius: '12px', textDecoration: 'none', color: 'inherit', background: 'rgba(0,0,0,0.2)', transition: 'all 0.3s ease'}}>
                  <span style={{textTransform: 'capitalize', fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)'}}>{store}</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{fontWeight: '900', color: 'var(--primary)', fontSize: '1.2rem'}}>{details.price}</span>
                    <Icons.Globe />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Ratings Summary */}
        <div style={{ marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
           <h3 className="heading-lg" style={{marginBottom: '1.5rem'}}>User Ratings Summary</h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3rem', alignItems: 'center' }}>
             <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--text-light)', lineHeight: '1' }}>{avgRating}</div>
               <div style={{ color: '#fbbf24', fontSize: '1.5rem', margin: '0.5rem 0' }}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))}</div>
               <div style={{ color: 'var(--text-dim)' }}>Based on {ratingCounts.total.toLocaleString()} ratings</div>
             </div>
             <div>
               {[5, 4, 3, 2, 1].map(stars => {
                 const count = ratingCounts[stars];
                 const pct = ratingCounts.total > 0 ? (count / ratingCounts.total) * 100 : 0;
                 return (
                   <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                     <div style={{ width: '60px', color: 'var(--text-muted)', fontWeight: '500' }}>{stars} Stars</div>
                     <div style={{ flex: '1', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                       <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '5px' }}></div>
                     </div>
                     <div style={{ width: '60px', textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.9rem' }}>{count.toLocaleString()}</div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>

        {/* AI Summary */}
        <div className="ai-summary" style={{ marginBottom: '2rem' }}>
          <div className="ai-summary-header"><Icons.Sparkles /> AI Review Summary</div>
          <p style={{fontSize: '1.05rem', lineHeight: '1.7'}}>{generateAISummary(product)}</p>
        </div>

        {/* Latest Reviews */}
        <div className="reviews-section">
          <h3 className="heading-lg" style={{marginBottom: '1.5rem'}}>Latest Reviews</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {product.reviews?.slice(0, 4).map((r, i) => (
              <div key={i} className="review-card" style={{padding: '1.5rem'}}>
                <div className="review-header" style={{marginBottom: '1rem'}}>
                  <strong style={{fontSize: '1.05rem', color: 'var(--text-light)'}}>{r.user}</strong>
                  <span style={{color: '#fbbf24', fontSize: '1.1rem'}}>{'★'.repeat(r.rating)}<span style={{color: 'var(--text-dim)'}}>{'★'.repeat(5-r.rating)}</span></span>
                </div>
                <p style={{fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-muted)'}}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const AboutPage = () => (
  <div>
    <section className="hero" style={{ padding: '10rem 2rem 4rem' }}>
      <div className="hero-content">
        <h1 className="heading-xl">About CompareX</h1>
        <p className="hero-subtitle">Your reference guide for technology comparisons.</p>
      </div>
      <WaveDivider />
    </section>
    <section className="products-section" style={{maxWidth: '800px', margin: '0 auto', padding: '0 2rem 4rem'}}>
      <div style={{marginBottom: '3rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)'}}>
        <h2 className="heading-lg" style={{marginBottom: '1rem'}}>Our Mission</h2>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)'}}>
          We are an impartial team of technology enthusiasts dedicated to helping you make informed decisions. We analyze everything from hardware to software tools, ensuring you get unbiased, data-backed insights. Every rating is derived from aggregated community benchmarks and deep technical evaluations, giving you the clearest picture of what a product really offers.
        </p>
      </div>
      <div style={{background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)'}}>
        <h2 className="heading-lg" style={{marginBottom: '1rem'}}>The Team</h2>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)'}}>
          CompareX was built by engineers, gamers, and reviewers who were tired of fragmented information. We've aggregated data from across the web—from open-source repositories to in-depth hardware forums—to establish a unified score you can trust.
        </p>
      </div>
    </section>
  </div>
);

const EditorialPage = () => (
  <div>
    <section className="hero" style={{ padding: '10rem 2rem 4rem' }}>
      <div className="hero-content">
        <h1 className="heading-xl">Editorial Guidelines</h1>
        <p className="hero-subtitle">How we test, rate, and review.</p>
      </div>
      <WaveDivider />
    </section>
    <section className="products-section" style={{maxWidth: '800px', margin: '0 auto', padding: '0 2rem 4rem'}}>
      <div style={{marginBottom: '2rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)', borderLeft: '4px solid var(--primary)'}}>
        <h3 className="heading-md" style={{marginBottom: '1rem'}}>1. Unbiased Aggregation</h3>
        <p style={{color: 'var(--text-muted)', lineHeight: '1.7'}}>
          We do not accept payment to artificially inflate ratings or manipulate review statuses. Our CompareXscore is generated using a combination of user-submitted benchmarks, GitHub activity, and aggregated forum sentiment.
        </p>
      </div>
      <div style={{marginBottom: '2rem', background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)', borderLeft: '4px solid var(--tertiary)'}}>
        <h3 className="heading-md" style={{marginBottom: '1rem'}}>2. Transparent Sourcing</h3>
        <p style={{color: 'var(--text-muted)', lineHeight: '1.7'}}>
          Whether we evaluate a graphics card's 3DMark score or a framework's npm package downloads, our metrics are presented openly. We link directly to official documentation, community repos, and certified retailers so you can verify our claims.
        </p>
      </div>
      <div style={{background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-glass)', borderLeft: '4px solid #10b981'}}>
        <h3 className="heading-md" style={{marginBottom: '1rem'}}>3. AI-Assisted, Human-Verified</h3>
        <p style={{color: 'var(--text-muted)', lineHeight: '1.7'}}>
          We use our proprietary AI models to parse thousands of reviews and generate concise summaries to save you time. However, every product page structure and definitive benchmark score is verified by a human expert before publication.
        </p>
      </div>
    </section>
  </div>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentParam, setCurrentParam] = useState(null);
  
  const [compareList, setCompareList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! I am the CompareX AI. What kind of tool or hardware are you looking for today?' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  // Load from fake backend
  useEffect(() => {
    const savedUser = localStorage.getItem('versus_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedWishlist = localStorage.getItem('versus_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const savedTheme = localStorage.getItem('comparex_theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('comparex_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  // Save to fake backend
  useEffect(() => {
    localStorage.setItem('versus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleLogin = (e) => {
    e.preventDefault();
    const newUser = { name: "Test User", email: "user@test.com" };
    setUser(newUser);
    localStorage.setItem('versus_user', JSON.stringify(newUser));
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('versus_user');
  };

  const navigateTo = (page, param = null) => {
    setCurrentPage(page);
    setCurrentParam(param);
    window.scrollTo(0,0);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const lowerUserMsg = userMsg.toLowerCase();
      let keywords = lowerUserMsg.split(' ').filter(w => w.length > 2);
      
      const relevantItems = productsData.filter(p => {
        const str = (p.title + " " + p.category).toLowerCase();
        return keywords.some(k => str.includes(k));
      }).slice(0, 5);
      
      const itemsToPass = relevantItems.length > 0 ? relevantItems : productsData.slice(0, 3);
      const availableItems = itemsToPass.map(p => `[PRODUCT_ID: ${p.id}] ${p.title} (${p.category})`).join(', ');
      
      const prompt = `You are CompareX AI.
Data: ${availableItems}
User: ${userMsg}
Task: Respond nicely. MUST include EXACT string [PRODUCT_ID: id] of recommended items.`;

      const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt));
      
      if (!response.ok) {
        throw new Error("Failed to contact API");
      }

      let responseText = await response.text();

      // If the API somehow still returns the deprecation notice instead of the completion, trigger our local fallback.
      if (responseText.includes("Pollinations legacy text API is being deprecated")) {
        throw new Error("API returned deprecation notice");
      }
      
      const match = responseText.match(/\[PRODUCT_ID:\s*(\d+)\]/i);
      let productId = null;
      let cleanText = responseText;
      if (match) {
        productId = parseInt(match[1]);
        cleanText = responseText.replace(match[0], '').trim();
      }

      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: cleanText,
        productId: productId
      }]);

    } catch (error) {
      // Local AI heuristic simulation
      const lowerMsg = userMsg.toLowerCase();
      let foundProduct = null;
      let text = "";
      
      const categorySynonyms = {
        'GRAPHICS CARDS': ['gpu', 'graphics', 'video card', 'rtx', 'rx', 'nvidia', 'amd', 'geforce', 'radeon'],
        'CPUs': ['cpu', 'processor', 'intel', 'ryzen', 'core i', 'chip'],
        'SSD': ['ssd', 'storage', 'drive', 'nvme', 'm.2', 'hard drive', 'samsung 9', 'crucial'],
        'TOOLS': ['tool', 'software', 'app', 'framework', 'library', 'code', 'dev', 'ide']
      };

      let matchedCategory = null;

      // 1. Direct title matching
      for (const p of productsData) {
        if (lowerMsg.includes(p.title.toLowerCase())) {
          foundProduct = p;
          break;
        }
      }

      // 2. Category matching via synonyms
      if (!foundProduct) {
        for (const [cat, synonyms] of Object.entries(categorySynonyms)) {
           // We use word boundaries or just inclusion for simplicity
          if (synonyms.some(syn => lowerMsg.includes(syn))) {
            matchedCategory = cat;
            break;
          }
        }
        
        if (matchedCategory) {
          const categoryProducts = productsData.filter(p => p.category === matchedCategory);
          // Pick the first featured one
          foundProduct = categoryProducts[0];
        }
      }
      
      if (foundProduct) {
        text = `Based on your request, I highly recommend the **${foundProduct.title}**. It's an excellent choice if you're looking into ${foundProduct.category.toLowerCase()}!`;
        setChatMessages(prev => [...prev, { role: 'ai', text: text, productId: foundProduct.id }]);
      } else {
        const responses = [
          "That sounds interesting! Could you specify if you're looking for a Tool, SSD, GPU, or CPU?",
          "I'd love to help! Tell me which specific task or hardware category you're focusing on.",
          "I have data on a lot of great tech. What category (like CPUs, Graphics Cards, or Tools) can I guide you towards?"
        ];
        text = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { role: 'ai', text: text }]);
      }
    }
    
    setIsAiLoading(false);
  };

  return (
    <div className="app-container">
      <Header 
        setShowAuth={setShowAuth} 
        navigateTo={navigateTo} 
        wishlist={wishlist} 
        setWishlist={setWishlist} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="main-content" style={{ paddingBottom: '100px' }}>
        {currentPage === 'home' && 
          <Home 
            compareList={compareList} setCompareList={setCompareList} 
            wishlist={wishlist} setWishlist={setWishlist} 
            navigateTo={navigateTo}
          />
        }
        {currentPage === 'category' && 
          <CategoryPage 
            categoryName={currentParam}
            compareList={compareList} setCompareList={setCompareList} 
            wishlist={wishlist} setWishlist={setWishlist} 
            navigateTo={navigateTo}
          />
        }
        {currentPage === 'compare' && 
          <Compare 
            compareList={compareList} setCompareList={setCompareList} 
            navigateTo={navigateTo}
          />
        }
        {currentPage === 'product' && 
          <ProductDetail 
            productId={currentParam} 
            navigateTo={navigateTo}
          />
        }
        {currentPage === 'wishlist' && 
          <WishlistPage 
            wishlist={wishlist} setWishlist={setWishlist} 
            compareList={compareList} setCompareList={setCompareList}
            navigateTo={navigateTo}
          />
        }
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'editorial' && <EditorialPage />}
      </main>

      <Footer navigateTo={navigateTo} setShowChat={setShowChat} />

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div className="compare-bar-fixed" style={{ bottom: 0, left: 0, right: 0, borderRadius: 0 }}>
          <span style={{color: 'var(--text-muted)'}}>{compareList.length}/3 items selected</span>
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            {compareList.map(p => (
              <div key={p.id} className="compare-item-chip">
                {p.title} 
                <button onClick={() => setCompareList(compareList.filter(item => item.id !== p.id))}><Icons.X /></button>
              </div>
            ))}
          </div>
          <button onClick={() => navigateTo('compare')} className="btn btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}>Compare Now</button>
        </div>
      )}

      {/* Floating AI Button */}
      <button 
        onClick={() => setShowChat(true)}
        style={{
          position: 'fixed',
          bottom: compareList.length > 0 ? '5rem' : '2rem',
          right: '2rem',
          zIndex: 100,
          background: 'linear-gradient(135deg, var(--primary), var(--tertiary))',
          color: '#0F172A',
          border: 'none',
          padding: '1rem',
          borderRadius: '999px',
          boxShadow: '0 8px 30px rgba(0,240,255,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,240,255,0.5)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,240,255,0.3)'; }}
      >
        <Icons.Brain /> AI Assistant
      </button>

      {/* Auth Modal */}
      {showAuth && (
        <div className="quiz-overlay" onClick={() => setShowAuth(false)}>
          <div className="quiz-modal" onClick={e => e.stopPropagation()}>
            <h2 className="heading-md" style={{marginBottom: '1.5rem'}}>{user ? 'Your Account' : 'Sign In'}</h2>
            {user ? (
              <div>
                <p style={{color: 'var(--text-muted)'}}>Welcome, <span style={{color: 'var(--primary)'}}>{user.name}</span>!</p>
                <p style={{color: 'var(--text-dim)', marginTop: '0.5rem'}}>Wishlist count: {wishlist.length}</p>
                <button onClick={handleLogout} className="btn btn-dark" style={{marginTop: '2rem'}}>Log Out</button>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label style={{display:'block', marginBottom:'0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>Email</label>
                  <input type="email" className="form-input" required defaultValue="user@test.com" />
                </div>
                <div className="form-group">
                  <label style={{display:'block', marginBottom:'0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>Password</label>
                  <input type="password" className="form-input" required defaultValue="password" />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop:'1rem'}}>Sign In / Register</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showChat && (
        <div className="quiz-overlay" onClick={() => setShowChat(false)}>
          <div className="quiz-modal" style={{display: 'flex', flexDirection: 'column', height: '500px', maxHeight: '90vh'}} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem'}}>
              <h2 className="heading-md" style={{margin: 0}}><span style={{color: 'var(--primary)', verticalAlign: 'middle', marginRight: '0.5rem'}}><Icons.Brain /></span> AI Assistant</h2>
              <button className="btn-icon" onClick={() => setShowChat(false)}><Icons.X /></button>
            </div>
            
            <div className="chat-messages" style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem', marginBottom: '1rem'}}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--tertiary))' : 'var(--bg-glass-strong)',
                  color: msg.role === 'user' ? '#0F172A' : 'var(--text-main)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                  borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                  maxWidth: '85%',
                  lineHeight: '1.5',
                  border: msg.role === 'ai' ? '1px solid var(--border-glass)' : 'none',
                  fontWeight: msg.role === 'user' ? 600 : 400
                }}>
                  {msg.text}
                  {msg.productId && (
                    <div style={{marginTop: '0.5rem'}}>
                      <button 
                        className="btn btn-dark" 
                        style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}
                        onClick={() => {
                          setShowChat(false);
                          navigateTo('product', msg.productId);
                        }}
                      >
                        View Product
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isAiLoading && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: 'var(--bg-glass-strong)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  borderBottomLeftRadius: '2px',
                  maxWidth: '85%',
                  lineHeight: '1.5',
                  border: '1px solid var(--border-glass)',
                  fontStyle: 'italic',
                  color: 'var(--text-dim)'
                }}>
                  Thinking...
                </div>
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask for a tool recommendation..." 
                className="form-input" 
                style={{flex: 1, margin: 0}} 
              />
              <button type="submit" className="btn btn-primary" disabled={!chatInput.trim()}>Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
