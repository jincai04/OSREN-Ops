import * as XLSX from 'xlsx';
import { InventoryItem } from '../types';

export const readExcel = (file: File): Promise<InventoryItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('No data read');
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // Assume first row is headers
        const headers = json[0] as string[];
        const rows = json.slice(1) as any[][];
        const inventory: InventoryItem[] = rows.map(row => {
          const item: any = {};
          headers.forEach((header, index) => {
            item[header] = row[index];
          });
          return {
            id: item.id || item.ID,
            name: item.name || item.Name,
            sku: item.sku || item.SKU,
            quantity: parseInt(item.quantity || item.Quantity || 0),
            minLevel: parseInt(item.minLevel || item.MinLevel || 10),
            category: item.category || item.Category,
            lastMovement: item.lastMovement || item.LastMovement || new Date().toISOString().split('T')[0],
          } as InventoryItem;
        });
        resolve(inventory);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const writeExcel = (inventory: InventoryItem[]) => {
  const data = inventory.map(item => ({
    ID: item.id,
    Name: item.name,
    SKU: item.sku,
    Quantity: item.quantity,
    MinLevel: item.minLevel,
    Category: item.category,
    LastMovement: item.lastMovement,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
  XLSX.writeFile(workbook, 'inventory.xlsx');
};
