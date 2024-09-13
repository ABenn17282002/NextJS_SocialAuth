"use client"
import React from 'react'
import { Button } from './ui/button'
import Link from "next/link";
import useUser from '@/app/hook/useUser';
import Image from 'next/image';
import { createSupabaseBrowser } from '@/lib/supabase/browser';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedPaths } from '@/lib/constant';

export default function Profile() {

  const { isFetching, data } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  if (isFetching) {
    return <></>;
  }

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser();
    queryClient.clear();
    await supabase.auth.signOut();
    router.refresh();

    if (ProtectedPaths.includes(pathname)) {
      router.replace("/auth?next=" + pathname);
    }
  };
  

  return (
    <div>
    {!data?.id ? (
      <Link href="/auth" className="animate-fade">
        <Button variant="outline">SignIn</Button>
      </Link>
    ) : (
      <>
        {data?.image_url ? (
          <Image
            src={data.image_url || "/images/default-avatar.png"}
            alt={data.display_name || ""}
            width={50}
            height={50}
            className="rounded-full animate-fade ring-2
            cursor-pointer"
            onClick={handleLogout}
        />
      ) : (
        <div className="h-[50px] w-[50px] flex items-center justify-center text-2xl font-bold"
        onClick={handleLogout}>
          <h1>{data?.email ? data.email[0] : "?"}</h1>
        </div>
      )}

      </>
    )}
  </div>
  )
}
