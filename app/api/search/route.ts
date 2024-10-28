import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface SectionData {
  section_id: string;
  title: string;
  data: any;
  module_id: number;
  order_id: number;
  section_type: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('q');

  if (!searchTerm) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('search_sections', {
      search_term: searchTerm
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No results found' }, { status: 200 });
    }

    console.log('Raw data from Supabase:', JSON.stringify(data, null, 2));

    const formattedResults = (data as SectionData[]).map(item => {
      let snippet = '';
      let content = '';
      if (typeof item.data === 'object') {
        if (item.data.content) {
          content = item.data.content;
        } else if (item.data.question) {
          content = item.data.question;
        } else if (item.data.cardPairs) {
          content = item.data.cardPairs.map((pair: any) => `${pair.concept}: ${pair.details}`).join(' | ');
        } else {
          content = JSON.stringify(item.data);
        }
      } else if (typeof item.data === 'string') {
        content = item.data;
      }
      
      snippet = content.slice(0, 150) + (content.length > 150 ? '...' : '');
    
      return {
        sectionId: item.section_id,
        moduleId: item.module_id,
        title: item.title,
        snippet: snippet,
        sectionType: item.section_type
      };
    });

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while searching' }, { status: 500 });
  }
}