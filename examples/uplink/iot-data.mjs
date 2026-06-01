/**
 * Generates realistic IoT sensor readings for use in uplink examples.
 */
import { faker } from "@faker-js/faker";

export function generateSensorReading() {
  return {
    temperature: faker.number.float({ min: -10, max: 40, fractionDigits: 1 }),
    humidity: faker.number.float({ min: 20, max: 95, fractionDigits: 1 }),
    co2: faker.number.int({ min: 400, max: 2000 }),
  };
}
