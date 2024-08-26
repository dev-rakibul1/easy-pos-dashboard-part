// import { NextApiRequest, NextApiResponse } from 'next'
// import { NextResponse } from 'next/server'

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   return NextResponse.json({ name: 'File uploaded' })
// }

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  return NextResponse.json({ name: 'File uploaded' })
}
