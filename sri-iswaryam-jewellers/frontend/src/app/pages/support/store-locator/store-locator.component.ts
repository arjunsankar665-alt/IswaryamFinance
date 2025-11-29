import { Component, OnInit } from '@angular/core';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  mapUrl: string;
  timing: string;
  services: string[];
  image: string;
  distance?: number;
}

@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.css']
})
export class StoreLocatorComponent implements OnInit {
  searchQuery = '';
  selectedCity = '';
  selectedStore: Store | null = null;

  cities = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'];

  stores: Store[] = [
    {
      id: '1',
      name: 'Sri Iswaryam T. Nagar',
      address: '123, Jewellery Street, T. Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      phone: '+91 44 2815 1234',
      email: 'tnagar@sriiswaryam.com',
      mapUrl: 'https://maps.google.com/?q=13.0339,80.2264',
      timing: 'Mon-Sun: 10:00 AM - 9:00 PM',
      services: ['Gold', 'Diamond', 'Silver', 'Exchange', 'Customization'],
      image: 'assets/images/stores/tnagar.jpg'
    },
    {
      id: '2',
      name: 'Sri Iswaryam Anna Nagar',
      address: '45, Second Avenue, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      phone: '+91 44 2616 5678',
      email: 'annanagar@sriiswaryam.com',
      mapUrl: 'https://maps.google.com/?q=13.0850,80.2101',
      timing: 'Mon-Sun: 10:00 AM - 9:00 PM',
      services: ['Gold', 'Diamond', 'Silver', 'Exchange'],
      image: 'assets/images/stores/annanagar.jpg'
    },
    {
      id: '3',
      name: 'Sri Iswaryam RS Puram',
      address: '78, Big Bazaar Street, RS Puram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641002',
      phone: '+91 422 254 7890',
      email: 'rspuram@sriiswaryam.com',
      mapUrl: 'https://maps.google.com/?q=11.0168,76.9558',
      timing: 'Mon-Sun: 10:30 AM - 8:30 PM',
      services: ['Gold', 'Diamond', 'Customization'],
      image: 'assets/images/stores/rspuram.jpg'
    },
    {
      id: '4',
      name: 'Sri Iswaryam Madurai',
      address: '156, West Masi Street, Near Meenakshi Temple',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625001',
      phone: '+91 452 234 5678',
      email: 'madurai@sriiswaryam.com',
      mapUrl: 'https://maps.google.com/?q=9.9252,78.1198',
      timing: 'Mon-Sun: 10:00 AM - 9:00 PM',
      services: ['Gold', 'Silver', 'Temple Jewellery', 'Exchange'],
      image: 'assets/images/stores/madurai.jpg'
    }
  ];

  ngOnInit(): void {}

  get filteredStores(): Store[] {
    let result = this.stores;
    
    if (this.selectedCity) {
      result = result.filter(s => s.city === this.selectedCity);
    }
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) ||
        s.pincode.includes(query)
      );
    }
    
    return result;
  }

  selectStore(store: Store): void {
    this.selectedStore = store;
  }

  openMap(store: Store): void {
    window.open(store.mapUrl, '_blank');
  }

  getDirections(store: Store): void {
    const destination = `${store.address}, ${store.city}, ${store.state} ${store.pincode}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  }

  callStore(phone: string): void {
    window.location.href = `tel:${phone}`;
  }
}
