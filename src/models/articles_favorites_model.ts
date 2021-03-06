import BaseModel from "./base_model.ts";
import { QueryResult } from "../deps.ts";

export type ArticlesFavoritesEntity = {
  article_id: number;
  user_id: number;
  id?: number;
  value: boolean;
};

/**
 * @description
 * Returns an instance of the ArticlesFavoritesModel
 *
 * @param ArticlesFavoritesEntity inputObj
 *
 * @return ArticlesFavoritesModel An instance of the model with all properties set
 */
export function createArticlesFavoritesModelObject(
  inputObj: ArticlesFavoritesEntity,
): ArticlesFavoritesModel {
  return new ArticlesFavoritesModel(
    inputObj.article_id,
    inputObj.user_id,
    inputObj.value,
    inputObj.id,
  );
}

// (ebebbington) Error comes from this model adding the where method, that uses different
// params compared to BaseModel's where method
export class ArticlesFavoritesModel extends BaseModel {
  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - PROPERTIES //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @var number
   *
   * id of the associated article in the database
   */
  public article_id: number;

  /**
   * @var number
   *
   * Id of the associated user in the database
   */
  public user_id: number;

  /**
   * @var number
   *
   * Id of the database row
   */
  public id: number;

  /**
   * @var boolean
   *
   * TODO(ebebbington) What is this property used for?
   */
  public value: boolean;

  /**
   * TODO(ebebbington) What is this property used for?
   */
  public query: string = "";

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - CONSTRCUTOR /////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param number articleId
   * @param number authorId
   * @param boolean value
   * @param number id=-1
   */
  constructor(
    articleId: number,
    authorId: number,
    value: boolean,
    id: number = -1,
  ) {
    super();
    this.article_id = articleId;
    this.user_id = authorId;
    this.value = value;
    this.id = id;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - CRUD //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Delete this model.
   *
   * @return Promise<boolean>
   */
  public async delete(): Promise<boolean> {
    let query = `DELETE FROM articles WHERE id = ?`;
    query = this.prepareQuery(
      query,
      [
        String(this.id),
      ],
    );

    try {
      const client = await BaseModel.connect();
      const dbResult: QueryResult = await client.query(query);
      client.release();
      if (dbResult.rowCount! < 1) {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  /**
   * Save this model.
   *
   * @return Promise<ArticlesFavoritesModel|null> Null if the query failed to save
   */
  public async save(): Promise<ArticlesFavoritesModel | null> {
    // If this model already has an ID, then that means we're updating the model
    if (this.id != -1) {
      return this.update();
    }

    let query = "INSERT INTO articles_favorites " +
      " (article_id, user_id, value)" +
      " VALUES (?, ?, ?);";
    query = this.prepareQuery(
      query,
      [
        String(this.article_id),
        String(this.user_id),
        String(this.value),
      ],
    );

    const client = await BaseModel.connect();
    const dbResult: QueryResult = await client.query(query);
    client.release();
    if (dbResult.rowCount! < 1) {
      return null;
    }

    const savedResult = await ArticlesFavoritesModel.where(
      { article_id: this.article_id },
    );
    if (savedResult.length === 0) {
      return null;
    }
    return savedResult[0];
  }

  /**
   * Update this model.
   *
   * @return Promise<ArticlesFavoritesModel|null> Null if the query failed to update
   */
  public async update(): Promise<ArticlesFavoritesModel | null> {
    let query = "UPDATE articles_favorites SET " +
      "value = ? " +
      `WHERE id = '${this.id}';`;
    query = this.prepareQuery(
      query,
      [
        String(this.value),
      ],
    );
    const client = await BaseModel.connect();
    const dbResult: QueryResult = await client.query(query);
    client.release();
    if (dbResult !== undefined) {
      if (dbResult.rowCount! < 1) {
        return null;
      }
    }

    // (crookse) We ignore this because this will never return null.
    const updatedResult = await ArticlesFavoritesModel.where(
      { article_id: this.article_id },
    );
    if (updatedResult.length >= 1) {
      return updatedResult[0];
    }
    return null;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - STATIC ////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @description
   *     See BaseModel.Where()
   *
   * @param {[key: string]: string|number} fields
   *
   * @return Promise<ArticlesFavoritesModel[]|[]>
   */
  static async where(
    fields: { [key: string]: string | number },
  ): Promise<ArticlesFavoritesModel[] | []> {
    let results = await BaseModel.Where("articles_favorites", fields);

    if (results.length <= 0) {
      return [];
    }

    // Nothing we can do about this.. the createUserModelObject expect
    // a user object type, but there's no way to type it like that the return type of whereIn can't be user
    const articleFavorites: Array<ArticlesFavoritesModel> = [];
    results.forEach((result) => {
      const entity: ArticlesFavoritesEntity = {
        article_id: typeof result.article_id === "number"
          ? result.article_id
          : 0,
        id: typeof result.id === "number" ? result.id : 0,
        user_id: typeof result.user_id === "number" ? result.user_id : 0,
        value: typeof result.value === "boolean" ? result.value : false,
      };
      articleFavorites.push(createArticlesFavoritesModelObject(entity));
    });
    return articleFavorites;
  }

  /**
   * @description
   *     See BaseModel.WhereIn()
   *
   * @param string column
   * @param string[]|number[] values
   *
   * @return Promise<ArticlesFavoritesModel[]|[]>
   */
  static async whereIn(
    column: string,
    values: string[] | number[],
  ): Promise<ArticlesFavoritesModel[] | []> {
    let results = await BaseModel.WhereIn("articles_favorites", {
      column,
      values,
    });

    if (results.length <= 0) {
      return [];
    }

    const articles: Array<ArticlesFavoritesModel> = [];
    results.forEach((result) => {
      const entity: ArticlesFavoritesEntity = {
        article_id: typeof result.article_id === "number"
          ? result.article_id
          : 0,
        user_id: typeof result.user_id === "number" ? result.user_id : 0,
        value: typeof result.value === "boolean" ? result.value : false,
        id: typeof result.id === "number" ? result.id : 0,
      };
      articles.push(createArticlesFavoritesModelObject(entity));
    });
    return articles;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - PUBLIC ////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @description
   * Constructs an object of this models properties
   *
   * @return ArticlesFavoritesEntity
   */
  public toEntity(): ArticlesFavoritesEntity {
    return {
      id: this.id,
      article_id: this.article_id,
      user_id: this.user_id,
      value: this.value,
    };
  }
}
