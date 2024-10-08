import prisma from "@/lib/db";
import { TProperty, TSearchParams } from "@/types";

export async function getPropertyData(searchParams: TSearchParams) {
  const {
    city,
    min: minPrice,
    max: maxPrice,
    wifi,
    tv,
    washingMachine,
    parking,
    airConditioning,
  } = searchParams;

  const whereClause: any = {};
  if (city) {
    whereClause.City = { startsWith: city, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = Number(minPrice);
    if (maxPrice) whereClause.price.lte = Number(maxPrice);
  }

  // Handle boolean filters with OR clause
  const amenitiesFilter = [];
  if (wifi) whereClause.wifi = Boolean(wifi);
  if (tv) whereClause.tv = Boolean(tv);
  if (washingMachine) whereClause.washingMachine = Boolean(washingMachine);
  if (parking) whereClause.parking = Boolean(parking);
  if (airConditioning) whereClause.airConditioning = Boolean(airConditioning);

  const data = (await prisma.property.findMany({
    where: whereClause,
    select: {
      title: true,
      titleSlug: true,
      propertyType: true,
      State: true,
      City: true,
      description: true,
      bedRooms: true,
      bathRooms: true,
      price: true,
      District: true,
      images: true,
    },
  })) as TProperty[];

  return data;
}
