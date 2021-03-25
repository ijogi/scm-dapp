export const SHIPMENT_STATUS: ShipmentStatus = Object.freeze({
  PICKUP: 'PICKUP',
  IN_TRANSIT: 'IN_TRANSIT',
  AT_LOGISTICS_CENTER: 'AT_LOGISTICS_CENTER',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
});

export interface ShipmentStatus {
  PICKUP: string;
  IN_TRANSIT: string;
  AT_LOGISTICS_CENTER: string;
  OUT_FOR_DELIVERY: string;
  DELIVERED: string;
}
