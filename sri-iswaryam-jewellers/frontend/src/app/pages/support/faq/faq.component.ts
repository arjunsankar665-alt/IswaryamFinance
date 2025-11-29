import { Component, OnInit } from '@angular/core';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  faqs: FAQItem[];
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'all';
  
  faqCategories: FAQCategory[] = [
    {
      id: 'orders',
      name: 'Orders & Shipping',
      icon: 'truck',
      faqs: [
        {
          id: 'o1',
          question: 'How can I track my order?',
          answer: 'Once your order is shipped, you will receive a tracking number via SMS and email. You can use this number to track your order on our website under "My Account > Orders" or directly on the courier partner\'s website.',
          isOpen: false
        },
        {
          id: 'o2',
          question: 'What are the shipping charges?',
          answer: 'We offer FREE shipping on all orders above ₹10,000. For orders below ₹10,000, a nominal shipping charge of ₹99 applies. All shipments are fully insured.',
          isOpen: false
        },
        {
          id: 'o3',
          question: 'How long does delivery take?',
          answer: 'Standard delivery takes 5-7 business days. Express delivery (available in select cities) takes 2-3 business days. Custom orders may take 2-3 weeks depending on the design complexity.',
          isOpen: false
        },
        {
          id: 'o4',
          question: 'Do you deliver internationally?',
          answer: 'Yes, we ship to over 30 countries. International shipping charges vary based on location and weight. Delivery typically takes 10-15 business days. Custom duties and taxes are the responsibility of the recipient.',
          isOpen: false
        }
      ]
    },
    {
      id: 'returns',
      name: 'Returns & Exchange',
      icon: 'refresh',
      faqs: [
        {
          id: 'r1',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for all products. Items must be unworn, in original packaging with all certificates and tags intact. Custom-made jewellery cannot be returned unless there\'s a manufacturing defect.',
          isOpen: false
        },
        {
          id: 'r2',
          question: 'How do I initiate a return?',
          answer: 'To initiate a return, go to "My Account > Orders", select the order and click "Return Item". Our team will arrange a secure pickup. Refunds are processed within 7-10 business days after we receive and verify the item.',
          isOpen: false
        },
        {
          id: 'r3',
          question: 'Can I exchange my purchase?',
          answer: 'Yes, you can exchange any item within 30 days of delivery. If the new item is of higher value, you pay the difference. If lower, we issue a store credit for the balance.',
          isOpen: false
        }
      ]
    },
    {
      id: 'payment',
      name: 'Payment & Pricing',
      icon: 'credit-card',
      faqs: [
        {
          id: 'p1',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI, Net Banking, Wallets (Paytm, PhonePe), and EMI options from leading banks. Cash on Delivery is available for orders up to ₹50,000.',
          isOpen: false
        },
        {
          id: 'p2',
          question: 'Is EMI available on purchases?',
          answer: 'Yes, we offer No-Cost EMI on purchases above ₹3,000 for tenures of 3, 6, 9, and 12 months on select bank cards. EMI options are displayed at checkout.',
          isOpen: false
        },
        {
          id: 'p3',
          question: 'How is jewellery pricing calculated?',
          answer: 'Our pricing includes: Current metal rate + Making charges (varies by design complexity) + GST (3%). Diamond and gemstone prices are based on the 4Cs (Cut, Color, Clarity, Carat). All prices are transparent and detailed on each product page.',
          isOpen: false
        }
      ]
    },
    {
      id: 'products',
      name: 'Products & Quality',
      icon: 'gem',
      faqs: [
        {
          id: 'pr1',
          question: 'Are your products BIS hallmarked?',
          answer: 'Yes, all our gold jewellery is BIS hallmarked guaranteeing purity. We offer 22K (916) and 18K (750) gold options. Each piece comes with a hallmark certificate.',
          isOpen: false
        },
        {
          id: 'pr2',
          question: 'Do you provide diamond certificates?',
          answer: 'Yes, all diamonds above 0.30 carats come with certificates from internationally recognized labs (IGI/GIA/SGL). Smaller diamonds are accompanied by our in-house quality certification.',
          isOpen: false
        },
        {
          id: 'pr3',
          question: 'Can I customize jewellery designs?',
          answer: 'Absolutely! We offer customization services. Share your design idea or reference images with our design team. We\'ll create a CAD design, get your approval, and craft your unique piece within 2-4 weeks.',
          isOpen: false
        }
      ]
    },
    {
      id: 'loyalty',
      name: 'Loyalty Program',
      icon: 'star',
      faqs: [
        {
          id: 'l1',
          question: 'How does the loyalty program work?',
          answer: 'Earn 1 point for every ₹100 spent. Points can be redeemed for discounts on future purchases. 100 points = ₹50 discount. Points are valid for 2 years from the earning date.',
          isOpen: false
        },
        {
          id: 'l2',
          question: 'What are the membership tiers?',
          answer: 'We have 4 tiers: Silver (0-10K points), Gold (10K-25K), Platinum (25K-50K), and Diamond (50K+). Higher tiers unlock exclusive benefits like early access to collections, special discounts, and complimentary services.',
          isOpen: false
        }
      ]
    }
  ];

  ngOnInit(): void {}

  toggleFAQ(categoryId: string, faqId: string): void {
    const category = this.faqCategories.find(c => c.id === categoryId);
    if (category) {
      const faq = category.faqs.find(f => f.id === faqId);
      if (faq) {
        faq.isOpen = !faq.isOpen;
      }
    }
  }

  get filteredCategories(): FAQCategory[] {
    let categories = this.selectedCategory === 'all' 
      ? this.faqCategories 
      : this.faqCategories.filter(c => c.id === this.selectedCategory);
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      categories = categories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(f => 
          f.question.toLowerCase().includes(query) || 
          f.answer.toLowerCase().includes(query)
        )
      })).filter(cat => cat.faqs.length > 0);
    }
    
    return categories;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
  }
}
