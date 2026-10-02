import { expect, test } from 'vitest'
import { getDistance, getClosestStation } from '../lib/hko-api'

test('getDistance calculates haversine distance correctly', () => {
  // Coordinates for Hong Kong Observatory and King's Park
  const hko = { lat: 22.301, lon: 114.174 }
  const kp = { lat: 22.311, lon: 114.172 }

  const distance = getDistance(hko.lat, hko.lon, kp.lat, kp.lon)
  expect(distance).toBeGreaterThan(0.5) // ~1.1km
  expect(distance).toBeLessThan(2.0)
})

test('getClosestStation returns closest mapped station', () => {
    // Somewhere deep in Yuen Long
    const yl = { lat: 22.441, lon: 114.015 }

    // We expect it to match Yuen Long Park from the available stations
    const available = ["King's Park", "Hong Kong Observatory", "Yuen Long Park"]
    const closest = getClosestStation(yl.lat, yl.lon, available)
    expect(closest).toBe("Yuen Long Park")
})
