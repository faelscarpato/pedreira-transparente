#!/usr/bin/env python3
"""
SEO Audit Script - Analisa página HTML e identifica problemas de SEO

Uso:
    python seo_audit.py <arquivo.html>
    
Exemplo:
    python seo_audit.py index.html
"""

import sys
import re
from pathlib import Path
from html.parser import HTMLParser


class SEOAuditParser(HTMLParser):
    """Parser HTML para auditoria de SEO"""
    
    def __init__(self):
        super().__init__()
        self.meta_tags = {}
        self.headings = []
        self.images = []
        self.links = []
        self.title = None
        self.has_h1 = False
        self.in_head = False
        self.in_body = False
        self.issues = []
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == "head":
            self.in_head = True
        elif tag == "body":
            self.in_body = True
            self.in_head = False
        elif tag == "title" and self.in_head:
            pass  # Handled in handle_data
        elif tag == "meta" and self.in_head:
            name = attrs_dict.get("name", "")
            property_attr = attrs_dict.get("property", "")
            content = attrs_dict.get("content", "")
            
            if name:
                self.meta_tags[name] = content
            elif property_attr:
                self.meta_tags[property_attr] = content
                
        elif tag == "h1":
            self.has_h1 = True
            self.headings.append(("h1", attrs_dict.get("id", "")))
        elif tag in ["h2", "h3", "h4", "h5", "h6"]:
            self.headings.append((tag, attrs_dict.get("id", "")))
        elif tag == "img":
            self.images.append({
                "src": attrs_dict.get("src", ""),
                "alt": attrs_dict.get("alt", ""),
            })
        elif tag == "a":
            self.links.append({
                "href": attrs_dict.get("href", ""),
                "text": "",
                "title": attrs_dict.get("title", ""),
            })
    
    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False
        elif tag == "body":
            self.in_body = False
    
    def handle_data(self, data):
        if hasattr(self, '_last_tag') and self._last_tag == "title":
            self.title = data.strip()
    
    def handle_starttag_override(self, tag, attrs):
        self._last_tag = tag
        self.handle_starttag(tag, attrs)


def audit_seo(html_content):
    """Realiza auditoria de SEO no conteúdo HTML"""
    
    parser = SEOAuditParser()
    parser.feed(html_content)
    
    issues = []
    warnings = []
    
    # Verificar título
    if not parser.title:
        issues.append("❌ Título não encontrado")
    elif len(parser.title) < 30:
        warnings.append(f"⚠️  Título muito curto ({len(parser.title)} caracteres, recomendado 50-60)")
    elif len(parser.title) > 60:
        warnings.append(f"⚠️  Título muito longo ({len(parser.title)} caracteres, recomendado 50-60)")
    else:
        print(f"✅ Título: {parser.title}")
    
    # Verificar meta description
    description = parser.meta_tags.get("description", "")
    if not description:
        issues.append("❌ Meta description não encontrada")
    elif len(description) < 120:
        warnings.append(f"⚠️  Meta description muito curta ({len(description)} caracteres, recomendado 120-160)")
    elif len(description) > 160:
        warnings.append(f"⚠️  Meta description muito longa ({len(description)} caracteres, recomendado 120-160)")
    else:
        print(f"✅ Meta description: {description[:80]}...")
    
    # Verificar meta keywords
    keywords = parser.meta_tags.get("keywords", "")
    if not keywords:
        warnings.append("⚠️  Meta keywords não encontradas")
    else:
        keyword_count = len(keywords.split(","))
        print(f"✅ Keywords: {keyword_count} palavras-chave")
    
    # Verificar H1
    if not parser.has_h1:
        issues.append("❌ H1 não encontrado (deve haver exatamente um H1 por página)")
    else:
        h1_count = sum(1 for tag, _ in parser.headings if tag == "h1")
        if h1_count > 1:
            warnings.append(f"⚠️  Múltiplos H1 encontrados ({h1_count}), recomendado apenas 1")
        else:
            print("✅ H1 encontrado")
    
    # Verificar estrutura de headings
    heading_structure = [tag for tag, _ in parser.headings]
    if heading_structure and heading_structure[0] != "h1":
        warnings.append("⚠️  Primeira heading não é H1")
    
    # Verificar imagens sem alt
    images_without_alt = [img for img in parser.images if not img["alt"]]
    if images_without_alt:
        warnings.append(f"⚠️  {len(images_without_alt)} imagens sem atributo alt")
    else:
        print(f"✅ Todas as {len(parser.images)} imagens têm atributo alt")
    
    # Verificar Open Graph
    og_tags = [tag for tag in parser.meta_tags if tag.startswith("og:")]
    if not og_tags:
        warnings.append("⚠️  Open Graph tags não encontradas (importante para redes sociais)")
    else:
        print(f"✅ {len(og_tags)} Open Graph tags encontradas")
    
    # Verificar Twitter Card
    twitter_tags = [tag for tag in parser.meta_tags if tag.startswith("twitter:")]
    if not twitter_tags:
        warnings.append("⚠️  Twitter Card tags não encontradas")
    else:
        print(f"✅ {len(twitter_tags)} Twitter Card tags encontradas")
    
    # Verificar canonical
    if "canonical" not in [tag for tag in parser.meta_tags]:
        warnings.append("⚠️  Canonical URL não definida")
    else:
        print("✅ Canonical URL definida")
    
    return issues, warnings


def main():
    if len(sys.argv) < 2:
        print("Uso: python seo_audit.py <arquivo.html>")
        print("Exemplo: python seo_audit.py index.html")
        sys.exit(1)
    
    file_path = Path(sys.argv[1])
    
    if not file_path.exists():
        print(f"❌ Arquivo não encontrado: {file_path}")
        sys.exit(1)
    
    print(f"\n🔍 Auditoria de SEO: {file_path}\n")
    print("=" * 60)
    
    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    
    issues, warnings = audit_seo(html_content)
    
    print("\n" + "=" * 60)
    
    if issues:
        print("\n🚨 PROBLEMAS CRÍTICOS:")
        for issue in issues:
            print(f"  {issue}")
    
    if warnings:
        print("\n⚠️  AVISOS:")
        for warning in warnings:
            print(f"  {warning}")
    
    if not issues and not warnings:
        print("\n✅ Nenhum problema encontrado!")
    
    print("\n" + "=" * 60 + "\n")
    
    # Score
    total_checks = len(issues) + len(warnings)
    if total_checks == 0:
        score = 100
    else:
        score = max(0, 100 - (len(issues) * 20 + len(warnings) * 5))
    
    print(f"📊 Score de SEO: {score}/100")
    print()


if __name__ == "__main__":
    main()
