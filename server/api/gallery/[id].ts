export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  
  // Mock data (dalam produksi, ambil dari database)
  const galleryItems = [
    { 
      id: 1,
      title: 'Redmi 9', 
      caption: 'Pergantian eMMC', 
      text: 'Upgrade kapasitas eMMC menjadi 128GB untuk performa lebih cepat dan penyimpanan lebih besar.', 
      fullText: 'Proses pergantian eMMC pada Redmi 9 membutuhkan keahlian khusus karena chip terintegrasi dengan board. Kami menggunakan hot air gun dengan suhu terkontrol untuk melepas chip lama dan memasang chip baru dengan kapasitas 128GB. Setelah pemasangan, dilakukan flashing firmware dan testing menyeluruh untuk memastikan semua fungsi berjalan normal.',
      photos: [
        { url: '/case-studies/redmi9_emmc_1.jpg', caption: 'Kondisi eMMC sebelum diganti' },
        { url: '/case-studies/redmi9_emmc_2.jpg', caption: 'Proses penggantian eMMC' },
        { url: '/case-studies/redmi9_emmc_3.jpg', caption: 'Hasil akhir setelah penggantian' }
      ],
      category: 'eMMC Repair',
      date: '15 Jan 2024',
      duration: '3 jam'
    },
    // ... data lainnya
  ]
  
  const item = galleryItems.find(item => item.id === parseInt(id))
  
  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Item tidak ditemukan'
    })
  }
  
  // Simulasikan delay loading
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return item
})