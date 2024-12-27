import printOpening from "@/tests/utils/print-opening";

export const dynamic = 'force-dynamic';
 
export async function GET () {
  const env = printOpening()
  return Response.json({ data: env })
}
