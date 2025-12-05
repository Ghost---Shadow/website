#!/usr/bin/env python3
"""
Generate PDF files for all blog articles from localhost:3000
Automatically retries failed generations with longer timeout
"""

import os
import time
import zipfile
import re
from datetime import datetime
from playwright.sync_api import sync_playwright

BASE_URL = 'http://localhost:3000/blog/'

# Get the script directory and project root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Set paths relative to project root
OUTPUT_DIR = os.path.join(PROJECT_ROOT, 'public', 'pdfs')
BLOG_REGISTRY_PATH = os.path.join(PROJECT_ROOT, 'src', 'components', 'BlogShell', 'blog-registry.js')

# Configuration
INITIAL_TIMEOUT = 60000  # 60 seconds
RETRY_TIMEOUT = 120000   # 120 seconds for retry
INITIAL_WAIT = 3         # seconds
RETRY_WAIT = 5           # seconds

def parse_blog_registry():
    """Parse the blog-registry.js file to extract slugs and titles"""
    try:
        with open(BLOG_REGISTRY_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract blog entries using regex
        # Pattern matches: slug: 'value', title: 'value'
        pattern = r"\{\s*slug:\s*['\"]([^'\"]+)['\"]\s*,\s*title:\s*['\"]([^'\"]+)['\"]\s*,"

        matches = re.findall(pattern, content)

        if not matches:
            raise ValueError("No blog entries found in registry")

        blogs = [{'slug': slug, 'title': title} for slug, title in matches]

        print(f"✓ Loaded {len(blogs)} blogs from registry")
        return blogs

    except FileNotFoundError:
        print(f"✗ Error: Could not find blog registry at {BLOG_REGISTRY_PATH}")
        raise
    except Exception as e:
        print(f"✗ Error parsing blog registry: {e}")
        raise

def ensure_output_dir():
    """Create output directory if it doesn't exist"""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")


def get_pdf_size(slug):
    """Get the file size of a PDF in human-readable format"""
    pdf_path = os.path.join(OUTPUT_DIR, f"{slug}.pdf")
    if os.path.exists(pdf_path):
        size_bytes = os.path.getsize(pdf_path)
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.1f} KB"
        else:
            return f"{size_bytes / (1024 * 1024):.1f} MB"
    return "N/A"

def create_zip_archive(successful_blogs):
    """Create a zip file containing all PDFs"""
    zip_path = os.path.join(OUTPUT_DIR, 'all-blog-pdfs.zip')

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for blog in successful_blogs:
            slug = blog['slug']
            pdf_path = os.path.join(OUTPUT_DIR, f"{slug}.pdf")
            if os.path.exists(pdf_path):
                # Add PDF to zip with just the filename (no directory structure)
                zipf.write(pdf_path, f"{slug}.pdf")

    zip_size = os.path.getsize(zip_path)
    print(f"✓ Created zip archive: all-blog-pdfs.zip ({zip_size / (1024 * 1024):.1f} MB)")
    return zip_size

def generate_index_html(successful_blogs, zip_size=None):
    """Generate an index.html file listing all PDFs"""
    index_path = os.path.join(OUTPUT_DIR, 'index.html')

    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog PDFs - Index</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }}

        .container {{
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }}

        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }}

        .header h1 {{
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }}

        .header p {{
            opacity: 0.9;
            font-size: 0.95rem;
        }}

        .content {{
            padding: 2rem;
        }}

        .stats {{
            display: flex;
            justify-content: space-around;
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f7f9fc;
            border-radius: 8px;
        }}

        .stat {{
            text-align: center;
        }}

        .stat-value {{
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }}

        .stat-label {{
            font-size: 0.85rem;
            color: #666;
            margin-top: 0.25rem;
        }}

        .pdf-list {{
            list-style: none;
        }}

        .pdf-item {{
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f7f9fc;
            border-radius: 8px;
            transition: all 0.2s;
            border-left: 4px solid #667eea;
        }}

        .pdf-item:hover {{
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }}

        .pdf-item a {{
            text-decoration: none;
            color: inherit;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .pdf-title {{
            font-weight: 600;
            color: #2d3748;
            font-size: 1.05rem;
        }}

        .pdf-info {{
            display: flex;
            gap: 1rem;
            align-items: center;
        }}

        .pdf-size {{
            font-size: 0.85rem;
            color: #718096;
            background: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
        }}

        .download-icon {{
            color: #667eea;
            font-size: 1.2rem;
        }}

        .footer {{
            text-align: center;
            padding: 1.5rem;
            color: #718096;
            font-size: 0.85rem;
            background: #f7f9fc;
        }}

        .download-all-btn {{
            display: block;
            width: 100%;
            padding: 1rem 2rem;
            margin-bottom: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }}

        .download-all-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }}

        .download-all-btn:active {{
            transform: translateY(0);
        }}

        .btn-icon {{
            margin-right: 0.5rem;
            font-size: 1.3rem;
        }}

        .btn-size {{
            opacity: 0.9;
            font-size: 0.9rem;
            font-weight: normal;
            margin-left: 0.5rem;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 Blog Articles - PDF Archive</h1>
            <p>Generated on {datetime.now().strftime("%B %d, %Y at %H:%M:%S")}</p>
        </div>

        <div class="content">
            <div class="stats">
                <div class="stat">
                    <div class="stat-value">{len(successful_blogs)}</div>
                    <div class="stat-label">Total PDFs</div>
                </div>
                <div class="stat">
                    <div class="stat-value">{sum([os.path.getsize(os.path.join(OUTPUT_DIR, f"{blog['slug']}.pdf")) for blog in successful_blogs]) / (1024 * 1024):.1f} MB</div>
                    <div class="stat-label">Total Size</div>
                </div>
            </div>

            <a href="all-blog-pdfs.zip" class="download-all-btn" download>
                <span class="btn-icon">📦</span>
                Download All PDFs
                {f'<span class="btn-size">({zip_size / (1024 * 1024):.1f} MB)</span>' if zip_size else ''}
            </a>

            <ul class="pdf-list">
'''

    # Add each PDF to the list
    for blog in successful_blogs:
        slug = blog['slug']
        title = blog['title']
        size = get_pdf_size(slug)
        html_content += f'''                <li class="pdf-item">
                    <a href="{slug}.pdf" target="_blank">
                        <span class="pdf-title">{title}</span>
                        <div class="pdf-info">
                            <span class="pdf-size">{size}</span>
                            <span class="download-icon">⬇</span>
                        </div>
                    </a>
                </li>
'''

    html_content += '''            </ul>
        </div>

        <div class="footer">
            Generated by Blog PDF Generator
        </div>
    </div>
</body>
</html>
'''

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"\n✓ Generated index.html with {len(successful_blogs)} PDFs")

def generate_pdf(page, slug, timeout=INITIAL_TIMEOUT, wait_time=INITIAL_WAIT, retry=False):
    """Generate PDF for a single blog post"""
    url = f"{BASE_URL}{slug}"
    output_path = os.path.join(OUTPUT_DIR, f"{slug}.pdf")

    print(f"Loading: {url}")
    try:
        # Navigate to the page
        wait_until = 'domcontentloaded' if retry else 'networkidle'
        page.goto(url, wait_until=wait_until, timeout=timeout)

        # Initial wait for content to load
        if retry:
            print(f"  Waiting {wait_time}s for content to load...")
            time.sleep(wait_time)

        # Wait for KaTeX to render (check for .katex elements)
        print("  Waiting for LaTeX rendering...")
        try:
            page.wait_for_selector('.katex', timeout=5000 if not retry else 10000)
            print("  ✓ KaTeX elements found")
            if retry:
                time.sleep(3)  # Extra wait for KaTeX to finish rendering
        except:
            print("  - No KaTeX elements (or already loaded)")

        # Wait for all images to load
        print("  Waiting for images to load...")
        try:
            page.evaluate('''() => {
                return Promise.all(
                    Array.from(document.images)
                        .filter(img => !img.complete)
                        .map(img => new Promise(resolve => {
                            img.onload = img.onerror = resolve;
                        }))
                );
            }''')
            print("  ✓ Images loaded")
        except:
            print("  - Image loading check skipped")

        # Wait for Mantine tables to render
        try:
            page.wait_for_selector('table', timeout=2000)
            print("  ✓ Tables found")
        except:
            print("  - No tables found")

        # Additional wait for any animations or dynamic content
        if not retry:
            time.sleep(2)
        else:
            time.sleep(3)

        # Generate PDF
        print(f"  Generating PDF: {output_path}")
        page.pdf(
            path=output_path,
            format='A4',
            print_background=True,
            margin={
                'top': '20px',
                'right': '20px',
                'bottom': '20px',
                'left': '20px'
            },
            prefer_css_page_size=False
        )

        print(f"✓ Successfully generated: {slug}.pdf")
        return True
    except Exception as e:
        error_msg = str(e).split('\n')[0]  # Get first line of error
        print(f"✗ Error: {error_msg}")
        return False

def main():
    """Main function to generate all PDFs with automatic retry"""
    print("=" * 60)
    print("Blog PDF Generator")
    print("=" * 60)

    # Parse blog registry to get slugs and titles
    blogs = parse_blog_registry()

    ensure_output_dir()

    with sync_playwright() as p:
        # Launch browser in headless mode
        print("\nLaunching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # First pass: Generate PDFs for all blog posts
        successful = []
        failed = []

        print(f"\nGenerating PDFs for {len(blogs)} blog posts...")
        print("-" * 60)

        for i, blog in enumerate(blogs, 1):
            slug = blog['slug']
            pdf_path = os.path.join(OUTPUT_DIR, f"{slug}.pdf")
            print(f"\n[{i}/{len(blogs)}] Processing: {slug}")

            # Skip if PDF already exists
            if os.path.exists(pdf_path):
                print(f"✓ Skipping (already exists): {slug}.pdf ({get_pdf_size(slug)})")
                successful.append(blog)
                continue

            if generate_pdf(page, slug, timeout=INITIAL_TIMEOUT, wait_time=INITIAL_WAIT, retry=False):
                successful.append(blog)
            else:
                failed.append(blog)

        # Second pass: Retry failed generations with longer timeout
        if failed:
            print("\n" + "=" * 60)
            print(f"Retrying {len(failed)} failed blog posts with longer timeout...")
            print("=" * 60)

            retry_failed = []
            for i, blog in enumerate(failed, 1):
                slug = blog['slug']
                print(f"\n[Retry {i}/{len(failed)}] Processing: {slug}")
                if generate_pdf(page, slug, timeout=RETRY_TIMEOUT, wait_time=RETRY_WAIT, retry=True):
                    successful.append(blog)
                else:
                    retry_failed.append(blog)

            failed = retry_failed

        browser.close()

    # Generate zip archive and index.html
    if successful:
        print("\n" + "=" * 60)
        print("Creating zip archive and index...")
        print("=" * 60)
        zip_size = create_zip_archive(successful)
        generate_index_html(successful, zip_size)

    # Summary
    print("\n" + "=" * 60)
    print("FINAL SUMMARY")
    print("=" * 60)
    print(f"Total blog posts: {len(blogs)}")
    print(f"Successfully generated: {len(successful)}")
    print(f"Failed: {len(failed)}")

    if failed:
        print(f"\nFailed blog posts:")
        for blog in failed:
            print(f"  - {blog['slug']}")

    print(f"\nPDFs saved to: {OUTPUT_DIR}")
    if successful:
        print(f"Index page: {OUTPUT_DIR}/index.html")
    print("=" * 60)

    return len(failed) == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
