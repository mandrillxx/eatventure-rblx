import { MarketplaceService } from "@rbxts/services";

function pagesToTable(pages: Pages) {
	const items = [];
	let finished = false;
	while (!finished) {
		items.push(pages.GetCurrentPage());
		if (pages.IsFinished) {
			finished = true;
			break;
		}
		pages.AdvanceToNextPageAsync();
	}
	return items;
}

function iterPageItems(pages: Pages) {
	const contents = pagesToTable(pages);
	let pageNum = 1;
	const lastPageNum = contents.size();
	return coroutine.wrap(() => {
		while (pageNum <= lastPageNum) {
			for (const item of contents[pageNum]) {
				coroutine.yield(item);
			}
			pageNum++;
		}
	});
}

export function useProducts() {
	const products = [];

	const devProducts = MarketplaceService.GetDeveloperProductsAsync().GetCurrentPage();
	for (const item of devProducts) {
		products.push(item);
	}

	return products;
}
