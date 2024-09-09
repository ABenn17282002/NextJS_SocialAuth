"use client"
import React from 'react'
import { Button } from './ui/button'
import Link from "next/link";
import useUser from '@/app/hook/useUser';

export default function Profile() {

 const { isFetching, data } = useUser();

 if (isFetching) {
  return <></>;
}

  return (
    <div>
    {!data?.id ? (
      <Link href="/auth">
        <Button variant="outline">SignIn</Button>
      </Link>
    ) : (
      <h1>{data.display_name}</h1>
    )}
  </div>
  )
}
