import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type TrackingStage = 'ordered' | 'processing' | 'hallmarking' | 'shipped' | 'out-for-delivery' | 'delivered';

interface TrackingOrder {
  id: string;
  orderNumber: string;
  placedOn: string;
  expectedDelivery: string;
  customer: string;
  contact: string;
  address: string;
  carrier: string;
  trackingNumber: string;
  status: TrackingStage;
  milestones: Partial<Record<TrackingStage, string>>;
  items: Array<{ name: string; image: string; price: number }>;
}

interface TimelineStep {
  key: TrackingStage;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  trackingForm: FormGroup;
  isSubmitting = false;
  searchAttempted = false;
  selectedOrder: TrackingOrder | null = null;
  timeline: TimelineStep[] = [];

  private readonly destroy$ = new Subject<void>();
  private readonly stageOrder: TrackingStage[] = ['ordered', 'processing', 'hallmarking', 'shipped', 'out-for-delivery', 'delivered'];
  readonly stageLabels: Record<TrackingStage, string> = {
    ordered: 'Order Confirmed',
    processing: 'Crafting in Progress',
    hallmarking: 'Hallmarking & QC',
    shipped: 'Dispatched',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered'
  };
  private readonly stageDescriptions: Record<TrackingStage, string> = {
    ordered: 'Your order has been placed successfully.',
    processing: 'Artisans are preparing your jewellery with care.',
    hallmarking: 'BIS hallmarking and quality checks underway.',
    shipped: 'Courier partner has collected your parcel.',
    'out-for-delivery': 'Package is on its way to your doorstep.',
    delivered: 'Delivery confirmed. We hope you love it!'
  };

  private readonly mockOrders: TrackingOrder[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001234',
      placedOn: '15 Jan 2024, 09:24 AM',
      expectedDelivery: '26 Jan 2024',
      customer: 'Priya Sharma',
      contact: '9876543210',
      address: 'Apt 302, Sterling Residency, T. Nagar, Chennai - 600017',
      carrier: 'Delhivery Priority',
      trackingNumber: 'DL123456789IN',
      status: 'shipped',
      milestones: {
        ordered: '15 Jan, 09:24 AM',
        processing: '16 Jan, 11:05 AM',
        hallmarking: '18 Jan, 04:20 PM',
        shipped: '19 Jan, 08:45 PM'
      },
      items: [
        { name: 'Temple Heritage Necklace', image: 'assets/images/products/necklace-1.jpg', price: 125000 },
        { name: 'Kaasu Jhumka Earrings', image: 'assets/images/products/earring-1.jpg', price: 35000 }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002010',
      placedOn: '03 Feb 2024, 01:10 PM',
      expectedDelivery: '14 Feb 2024',
      customer: 'Rahul Mehta',
      contact: '9123456780',
      address: 'Villa 12, Palm Grove, Bengaluru - 560103',
      carrier: 'BlueDart',
      trackingNumber: 'BD5566778899',
      status: 'out-for-delivery',
      milestones: {
        ordered: '03 Feb, 01:10 PM',
        processing: '04 Feb, 09:00 AM',
        hallmarking: '06 Feb, 03:40 PM',
        shipped: '08 Feb, 07:25 PM',
        'out-for-delivery': '13 Feb, 08:05 AM'
      },
      items: [
        { name: 'Platinum Couple Bands', image: 'assets/images/products/ring-1.jpg', price: 89000 }
      ]
    }
  ];

  constructor(private readonly fb: FormBuilder, private readonly route: ActivatedRoute) {
    this.trackingForm = this.fb.group({
      orderNumber: ['', [Validators.required, Validators.minLength(6)]],
      contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const orderId = params.get('orderId');
      if (orderId) {
        this.lookupOrder(orderId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get progressPercent(): number {
    if (!this.selectedOrder) {
      return 0;
    }
    const currentIndex = this.stageOrder.indexOf(this.selectedOrder.status);
    return ((currentIndex + 1) / this.stageOrder.length) * 100;
  }

  get maskedContact(): string {
    if (!this.selectedOrder) {
      return '';
    }
    return this.selectedOrder.contact.replace(/.(?=.{4})/g, '•');
  }

  onSubmit(): void {
    this.searchAttempted = true;
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { orderNumber, contact } = this.trackingForm.value;
    setTimeout(() => {
      this.lookupOrder(orderNumber?.toString().trim() ?? '', contact?.toString().trim() ?? '');
      this.isSubmitting = false;
    }, 500);
  }

  trackByTimeline(_: number, step: TimelineStep): TrackingStage {
    return step.key;
  }

  private lookupOrder(orderIdentifier: string, contact?: string): void {
    const formattedId = orderIdentifier.toUpperCase();
    const match = this.mockOrders.find(order => {
      const idMatches = order.id === formattedId || order.orderNumber === formattedId;
      const contactMatches = contact ? order.contact === contact : true;
      return idMatches && contactMatches;
    });

    this.selectedOrder = match ?? null;
    if (match) {
      this.trackingForm.patchValue({
        orderNumber: match.orderNumber,
        contact: match.contact
      }, { emitEvent: false });
      this.timeline = this.buildTimeline(match);
    } else {
      this.timeline = [];
    }
  }

  private buildTimeline(order: TrackingOrder): TimelineStep[] {
    return this.stageOrder.map(stage => {
      let status: TimelineStep['status'] = 'upcoming';
      const stageIndex = this.stageOrder.indexOf(stage);
      const currentIndex = this.stageOrder.indexOf(order.status);
      if (stageIndex < currentIndex) {
        status = 'completed';
      } else if (stageIndex === currentIndex) {
        status = 'current';
      }

      return {
        key: stage,
        label: this.stageLabels[stage],
        description: this.stageDescriptions[stage],
        status,
        date: order.milestones[stage]
      };
    });
  }
}
