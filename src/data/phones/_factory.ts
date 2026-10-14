/**
 * 工厂转发层。
 *
 * 品类抽象（T01）后工厂已上提到 `src/data/_factory.ts`——平板 / 笔记本目录也要用同一套
 * 工厂，不能让「平板反向依赖 phones/」。这里保留一行转发，
 * 让 16 个品牌文件的 `import { c, type CompactSeed } from './_factory'` **一个字都不用改**。
 */
export * from '../_factory';
