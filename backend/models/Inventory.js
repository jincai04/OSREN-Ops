class Inventory {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.sku = data.sku;
    this.category = data.category;
    this.brand = data.brand;
    this.quantity = data.quantity;
    this.minLevel = data.minLevel;
    this.unitCost = data.unitCost;
    this.sellingPrice = data.sellingPrice;
    this.supplier = data.supplier;
    this.lastMovement = data.lastMovement;
  }

  // Methods
  isLowStock() {
    return this.quantity <= this.minLevel;
  }

  updateQuantity(newQuantity) {
    this.quantity = newQuantity;
    this.lastMovement = new Date().toISOString().split('T')[0];
  }
}

module.exports = Inventory;
