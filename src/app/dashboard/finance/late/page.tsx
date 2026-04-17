'use client';

import { CardDetail } from '@/components/finance/late-payment/card-detail';
import { CardDriver } from '@/components/finance/late-payment/card-driver';
import { StatsCard } from '@/components/finance/late-payment/card-stats';
import React, { useState } from 'react';

const driversData = {
  'DRV-009': {
    id: 'DRV-009',
    name: 'Budi Santoso',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgFMRuuzJMfExZiTiflbrrGbXprn693ZmzTEhCCjOUpbtnjxHKJM234zc9Iv5_ZQ6AYdHVjHXV3mjFjtCoJLwnGG-aD2h2YgLAxY0U8tbv2wRn72Jq6LUb9K0WCrrs4lRpjW__SWwUeCcC5MUpEt3ELhZO-1Php47jFGS3aV4co4yQYEFfm6X8D8ceoPJG8-9FgEx2iA2DUUg_ZJCV3rmZkV1sJnjK6Gh7gGYeQolixzSRp1GMohWAqnRU_qtMgCVc4wijC_G5yzoY',
    amount: 'Rp 1.500.000',
    time: '2 hrs ago',
    status: 'Pending',
    vehicle: 'Toyota Avanza',
    plate: 'B 1234 XYZ',
    dueDate: 'Oct 12, 2023',
    paymentDate: 'Oct 14, 2023',
    justification: 'Bank System Offline',
    justificationReason: 'Bank System Offline',
    message: '"I attempted to transfer the payment on Oct 12th at 13:45, but the BCA mobile banking system was down for maintenance. I tried again every hour until 8 PM. By the time it was back up, I was already on another shift in a remote area with poor signal. I have attached the screenshot of the error message."',
    proofImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQq0_J3jO-qWrEz3WnC_i3MDl7Gme96m15lq6iGBzXWP8lP6ZqwXdcWwrglUd3EmoUFjm6x7WCYiY-BoYEkNLuIdjlLqDCy4ExK1gNQsboKKYW6cRyRyRCGpgxI0EgN8hE7FUTi9CpTyVF99hNfmo7XZ2wgkWAlgcIDPO05QPNapICFYIy0gpIxSrDD4N3xF0A-FkjfVM761V2AoxeSNs4E5nw6wk3Vfah-rT77dNlAUkkOxKWlFUfYtv1jTF-MW1f_khdBglUOjXs'
  },

  'DRV-112': {
    id: 'DRV-112',
    name: 'Siti Aminah',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt58FAvKitEQXvE-LZ85BwZVPbF7UY3MoLOGJ9IAt1zf6UVwd71em0pAozmk6mnsXXF81jtbNPG84f37r5unCJeblhdKuO0OqCyZLJteZAD5crRnHtbwFGR4SFkXp25NU3kXTCdtNjqkD_nROv1J_NT912COaCBPpz-rNBrRWI_DCbNIGOxRwg7A4n6bUVb3r8CadYtjLhsWhjaGnAtIwPQBtDX1O-WY5l_CaT_Nwk4PHAFHkNyh8Q1-SLIJqNowLP_MAiGVKyou9a',
    amount: 'Rp 750.000',
    time: '5 hrs ago',
    status: 'Pending',
    vehicle: 'Honda Brio',
    plate: 'D 5678 ABC',
    dueDate: 'Oct 10, 2023',
    paymentDate: 'Oct 12, 2023',
    justification: 'Emergency Situation',
    justificationReason: 'Emergency Situation',
    message: '"There was a family emergency that required me to be at the hospital. I could not make the payment on time due to this urgent situation. I have attached the hospital documents as proof."',
    proofImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt58FAvKitEQXvE-LZ85BwZVPbF7UY3MoLOGJ9IAt1zf6UVwd71em0pAozmk6mnsXXF81jtbNPG84f37r5unCJeblhdKuO0OqCyZLJteZAD5crRnHtbwFGR4SFkXp25NU3kXTCdtNjqkD_nROv1J_NT912COaCBPpz-rNBrRWI_DCbNIGOxRwg7A4n6bUVb3r8CadYtjLhsWhjaGnAtIwPQBtDX1O-WY5l_CaT_Nwk4PHAFHkNyh8Q1-SLIJqNowLP_MAiGVKyou9a'
  },

  'DRV-045': {
    id: 'DRV-045',
    name: 'Ahmad Dhani',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkX66pns_aW4oQ-ZFIfevxLJP5Aan3TFJI1rQe9M2JoUGlV_BHXXcfMaZThTbIIIn7K3lUFRWNjxd2ZBYyAy1cHp0P2KTRD881nxJrrYCgm33T_zWioHw5DlnJ-mYy39ODRA1UQO_VFoCNPxTMsHztdDTSA4gAisYMOctSMEsbuQiWliP0_reaTOsgJY0Nf8tpotHH4Tk2WTd161fpTWYHKAvIA4BkNZInrGjuvS-aUhPSCNd6KLYFmm7seUtsC-24EksHdflR29du',
    amount: 'Rp 2.100.000',
    time: 'Yesterday',
    status: 'Pending',
    vehicle: 'Mitsubishi Xpander',
    plate: 'F 9012 DEF',
    dueDate: 'Oct 8, 2023',
    paymentDate: 'Oct 10, 2023',
    justification: 'Technical Issues',
    justificationReason: 'Technical Issues',
    message: '"The payment gateway was experiencing technical difficulties. I tried multiple times but the transaction kept failing. I have attached screenshots of the error messages."',
    proofImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkX66pns_aW4oQ-ZFIfevxLJP5Aan3TFJI1rQe9M2JoUGlV_BHXXcfMaZThTbIIIn7K3lUFRWNjxd2ZBYyAy1cHp0P2KTRD881nxJrrYCgm33T_zWioHw5DlnJ-mYy39ODRA1UQO_VFoCNPxTMsHztdDTSA4gAisYMOctSMEsbuQiWliP0_reaTOsgJY0Nf8tpotHH4Tk2WTd161fpTWYHKAvIA4BkNZInrGjuvS-aUhPSCNd6KLYFmm7seUtsC-24EksHdflR29du'
  }
};

// List driver untuk ditampilkan di sidebar
const driverList = [
  { id: 'DRV-009', name: 'Budi Santoso', imageUrl: driversData['DRV-009'].imageUrl, amount: driversData['DRV-009'].amount, time: driversData['DRV-009'].time, status: driversData['DRV-009'].status },
  { id: 'DRV-112', name: 'Siti Aminah', imageUrl: driversData['DRV-112'].imageUrl, amount: driversData['DRV-112'].amount, time: driversData['DRV-112'].time, status: driversData['DRV-112'].status },
  { id: 'DRV-045', name: 'Ahmad Dhani', imageUrl: driversData['DRV-045'].imageUrl, amount: driversData['DRV-045'].amount, time: driversData['DRV-045'].time, status: driversData['DRV-045'].status }
];

export default function LatePaymentPage() {
  const [selectedDriver, setSelectedDriver] = useState<string>('DRV-009');

  const currentDriver = driversData[selectedDriver as keyof typeof driversData];

  return (
    <div className="p-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard 
          title="Pending Request"
          value="12"
          icon=""
          iconColor=""
          trend={{
            icon: "arrow_upward",
            value: "+2 today",
            trendColor: "text-amber-700",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
          }}
        />
        <StatsCard 
          title="Approved Today"
          value="3"
          icon=""
          iconColor=""
          trend={{
            icon: '',
            value: '',
            trendColor: '',
            bgColor: ''
          }}          
        />
        <StatsCard 
          title="Rejected Today"
          value="1"
          icon=""
          iconColor="" 
          trend={{
            icon: '',
            value: '',
            trendColor: '',
            bgColor: ''
          }}         
        />
      </div>

      {/* Content Split View */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-320px)] min-h-[600px]">
        
        {/* List Column - Driver Cards */}
        <div className="w-full lg:w-4/12 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
          {driverList.map((driver) => (
            <CardDriver
              key={driver.id}
              id={driver.id}
              name={driver.name}
              imageUrl={driver.imageUrl}
              amount={driver.amount}
              time={driver.time}
              status={driver.status}
              isSelected={selectedDriver === driver.id}
              onClick={() => setSelectedDriver(driver.id)}
            />
          ))}
        </div>

        {/* Detail Column - Dynamic berdasarkan driver yang dipilih */}
        <CardDetail
          driverId={currentDriver.id}
          name={currentDriver.name}
          imageUrl={currentDriver.imageUrl}
          vehicle={currentDriver.vehicle}
          plate={currentDriver.plate}
          dueDate={currentDriver.dueDate}
          paymentDate={currentDriver.paymentDate}
          amount={currentDriver.amount}
          justification={currentDriver.justification}
          justificationReason={currentDriver.justificationReason}
          message={currentDriver.message}
          proofImageUrl={currentDriver.proofImageUrl}
          onReject={() => console.log(`Rejected ${currentDriver.name}`)}
          onApprove={() => console.log(`Approved ${currentDriver.name}`)}
          onViewProfile={() => console.log(`View profile ${currentDriver.name}`)}
        />
      </div>
    </div>
  );
}