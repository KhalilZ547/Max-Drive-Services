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
            <path d="M9.5,4.5h5.36c2.4,0,3.91,1.5,3.91,3.65,0,1.92-1.2,3.18-2.9,3.52v.09c1.61,.34,3.22,1.52,3.22,3.9,0,2.57-1.8,4.2-4.48,4.2H9.5V4.5ZM12,6.79h2c.9,0,1.4-.53,1.4-1.28s-.5-1.27-1.4-1.27h-2v2.55Zm.06,5.3h2.29c1,0,1.64-.6,1.64-1.46,0-1.09-.7-1.5-1.7-1.5H12.06v2.96Z" />
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
