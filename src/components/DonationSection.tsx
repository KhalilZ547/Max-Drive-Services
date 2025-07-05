'use client';

import { useTranslation } from '@/hooks/use-translation';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        <div className="max-w-2xl mx-auto group">
          <div className="text-center mb-12">
              <Heart strokeWidth={1.5} className="mx-auto h-12 w-12 text-primary mb-4 transition-all duration-300 group-hover:scale-110 group-hover:fill-destructive" />
              <h2 className="text-3xl md:text-4xl font-bold">{t('donation_title')}</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t('donation_subtitle')}</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="paypal" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paypal">{t('donation_paypal_tab')}</TabsTrigger>
                  <TabsTrigger value="bank">{t('donation_bank_tab')}</TabsTrigger>
                </TabsList>
                <TabsContent value="paypal" className="p-6 text-center">
                  <div className="space-y-4">
                      <p className="text-muted-foreground">{t('donation_paypal_desc')}</p>
                      <Button asChild size="lg" className="w-full max-w-xs mx-auto bg-[#00457C] hover:bg-[#003057]">
                          <a href="https://www.paypal.com/donate" target="_blank" rel="noopener noreferrer">
                              <span>{t('donation_paypal_button')}</span>
                          </a>
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
      </div>
    </section>
  );
}
