//assosiação muitos para muitos

import chefModel from "./chefModel.js"
import receitaModel from "./receitaModels.js"

chefModel.belongsToMany(receitaModel, {
      through:'chefs_receitas',
      foreignKey: 'chefs',
      otherKey: 'receita'
})

receitaModel.belongsToMany(chefModel, {
     through:'chefs_receitas',
    foreignKey: 'receita',
    otherKey: 'chefs'
})

export {chefModel, receitaModel}