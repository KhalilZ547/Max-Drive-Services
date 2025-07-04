'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function PayPalIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            <path d="M7.057 21.461c.49-.071 1.011-.475 1.011-.475.053 0 .084.021.116.031l.073.021c.147.042.305.084.474.126.284.073.589.116.905.116h.052c2.42-.01 4.495-.926 5.463-2.915.095-.2.253-.663.316-.863.379-1.284.347-2.652-.084-3.821-.442-1.189-1.284-2.126-2.4-2.757-1.147-.642-2.484-.968-3.926-.968H7.31c-.337 0-.663.042-.968.126l-.168.042c-.263.084-.505.2-.726.358-.232.168-.421.368-.568.589-.147.21-.253.453-.316.705-.063.253-.084.505-.063.747.021.242.084.484.168.705l.484 1.347c.053.126.126.253.2.379s.168.253.274.379c.105.126.232.231.368.316.137.094.284.168.442.221m8.88-10.29c.126-.263.232-.526.305-.789.726-2.62-1.168-4.83-3.8-5.323l-.168-.031c-.263-.053-.526-.084-.779-.084h-.358c-2.221 0-4.145.83-5.07 2.535-.294.536-.484 1.136-.568 1.767-.052.41.021.82.168 1.2.031.105.084.2.137.294.01.022.021.043.031.063.021.042.042.095.063.137.052.126.116.242.189.358.073.116.158.221.242.326.042.053.084.105.137.147.189.2.39.379.6.537l.021.01c.21.127.431.243.663.358.663.326 1.368.547 2.115.652.285.042.569.063.853.063h.147c.863 0 1.694-.179 2.452-.515.747-.326 1.368-.789 1.8-1.358M15.58 6.13c-.347-.074-1.284-.264-2.4-.443-1.031-.168-2.02-.252-2.914-.252h-.327c-1.336 0-2.525.4-3.524 1.157-1.01.768-1.747 1.799-2.125 3.019-.368 1.2-.337 2.483.085 3.651.431 1.189 1.273 2.126 2.388 2.757 1.136.642 2.473.968 3.914.968h.042c.315 0 .62-.031.905-.105.294-.063.578-.147.841-.242.484-.179.926-.41 1.305-.7l.19-.137c.368-.284.684-.631.926-1.021.242-.39.42-.821.515-1.284.095-.452.116-.915.063-1.368l-.484-2.736c-.053-.295-.127-.58-.232-.853-.105-.284-.242-.558-.41-.81Z"/>
        </svg>
    );
}

export function DonationSection() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const iban = t('donation_bank_iban_value');

  const handleCopy = () => {
    navigator.clipboard.writeText(iban);
    toast({
      title: t('copied_toast_title'),
      description: t('copied_toast_desc'),
    });
  };


  return (
    <section id="donation" className="py-20 bg-card">
      <div className="container">
        <div className="text-center mb-12">
            <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold">{t('donation_title')}</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t('donation_subtitle')}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-0">
            <Tabs defaultValue="paypal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paypal">{t('donation_paypal_tab')}</TabsTrigger>
                <TabsTrigger value="bank">{t('donation_bank_tab')}</TabsTrigger>
              </TabsList>
              <TabsContent value="paypal" className="p-6 text-center">
                <div className="space-y-4">
                    <p className="text-muted-foreground">{t('donation_paypal_desc')}</p>
                    <Button size="lg" className="w-full max-w-xs mx-auto bg-[#00457C] hover:bg-[#003057]">
                        <PayPalIcon />
                        <span className="ml-2">{t('donation_paypal_button')}</span>
                    </Button>
                </div>
              </TabsContent>
              <TabsContent value="bank" className="p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground text-center">{t('donation_bank_desc')}</p>
                  <div className="space-y-3 rounded-md border p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">{t('donation_bank_beneficiary')}:</span>
                        <span className="text-muted-foreground">{t('donation_bank_beneficiary_value')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">{t('donation_bank_name')}:</span>
                        <span className="text-muted-foreground">{t('donation_bank_name_value')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-semibold">{t('donation_bank_iban')}:</span>
                            <p className="text-muted-foreground text-sm font-mono">{iban}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
