import {Input, Output, EventEmitter, ViewChild, ElementRef, Component,AfterViewInit, OnChanges,SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Interface para cada item do carrossel:
export interface CarouselItem {
  id: number;
  title?: string;
  name?: string;         // (Para pessoas)
  imgSrc?: string; 
  link: string;
  rating?: number;
  vote?: number;
  character?: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CarouselComponent implements AfterViewInit, OnChanges {
  @Input() title!: string;
  @Input() items!: CarouselItem[];
  @Input() isExplore = false;
  @Input() exploreLink = '';
  @Input() isDefaultCarousel = true;
  @Input() isCastCarousel = false;

  @Output() itemClick = new EventEmitter<CarouselItem>();    // evento ao clicar no carrossel

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLElement>;    // referência ao container do carrossel para mexer com scroll

  // Botões de navegação:
  public canNavigateLeft = false;
  public canNavigateRight = false;

  private scrollDebounceTimer: any; // Atualização para manipulação com o scroll

  constructor() {}

  // Após o view ser inicializado, atualiza a navegação:
  ngAfterViewInit(): void {
    setTimeout(() => this.updateNavigation(), 0);
  }

  // Atualiza a navegação sempre que os itens mudam:
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      setTimeout(() => this.updateNavigation(), 0);
    }
  }

  // Atualiza navegação ao redimensionar a janela:
  @HostListener('window:resize')
  onResize(): void {
    this.updateNavigation();
  }

  // Navega para slide anterior:
  public prevSlide(): void {
    const container = this.carouselContainer.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  // Navega pra slide seguinte:
  public nextSlide(): void {
    const container = this.carouselContainer.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  // Atualiza para navegação esquerda/direita:
  public updateNavigation(): void {
    clearTimeout(this.scrollDebounceTimer);
    this.scrollDebounceTimer = setTimeout(() => {
      if (!this.carouselContainer) return;
      const container = this.carouselContainer.nativeElement;

      this.canNavigateLeft = container.scrollLeft > 0;

      const maxScroll = container.scrollWidth - container.clientWidth;
      this.canNavigateRight = container.scrollLeft < maxScroll - 1;
    }, 100);
  }

  // Emite evento ao clicar no item:
  public onItemClicked(item: CarouselItem): void {
    this.itemClick.emit(item);
  }

  // Retorna URL completa do pôster:
  public getPosterUrl(imgSrc: string): string {
    return `https://image.tmdb.org/t/p/w500${imgSrc}`;
  }
}
