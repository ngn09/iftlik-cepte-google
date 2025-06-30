
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/useAuth';

export const useFarmBranding = () => {
  const [farmName, setFarmName] = useState('Çiftliğim');
  const [farmLogo, setFarmLogo] = useState<string>();
  const { profile } = useAuth();

  useEffect(() => {
    const fetchFarmDetails = async () => {
      if (!profile?.farm_id) return;

      try {
        const { data, error } = await supabase
          .from('farms')
          .select('name, logo_url')
          .eq('id', profile.farm_id)
          .single();

        if (error) throw error;

        if (data) {
          setFarmName(data.name || 'Çiftliğim');
          setFarmLogo(data.logo_url);
        }
      } catch (error) {
        console.error('Çiftlik bilgileri alınırken hata:', error);
      }
    };

    fetchFarmDetails();
  }, [profile?.farm_id]);

  const updateBranding = (name: string, logo?: string) => {
    setFarmName(name);
    if (logo) setFarmLogo(logo);
  };

  return {
    farmName,
    farmLogo,
    updateBranding
  };
};
